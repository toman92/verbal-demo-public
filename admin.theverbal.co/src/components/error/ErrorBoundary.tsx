import React, { ErrorInfo, PropsWithChildren } from "react";
import { Error } from "../../core/components/Error";
import { API_URL } from "../../client/api/rest";
import { Box, Button, Container } from "@material-ui/core";
import VerbalLogo from "../../img/VerbalLogo";

type IProps = PropsWithChildren<unknown>;

enum ConnectionIssueType {
    Network = "Network",
    Api = "Api",
}

interface IState {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    connectionIssue: ConnectionIssueType | null;
    networkReconnected: boolean;
    networkPollId?: number;
}

export default class ErrorBoundary extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null,
            connectionIssue: null,
            networkReconnected: false,
            networkPollId: undefined,
        };
    }

    componentWillUnmount(): void {
        window.clearInterval(this.state.networkPollId);
    }

    async componentDidCatch(error: Error, errorInfo: ErrorInfo): Promise<void> {
        let connectionIssue = null;
        try {
            const response = await fetch(`${API_URL}/status`, {
                method: "GET",
            });

            if (!response.ok) {
                connectionIssue = ConnectionIssueType.Api;
            }
        } catch (error) {
            connectionIssue = ConnectionIssueType.Network;
            const intervalId = window.setInterval(async () => {
                try {
                    await fetch(`${API_URL}/status`, {
                        method: "GET",
                    });
                    this.setState({
                        networkReconnected: true,
                    });
                    window.clearInterval(intervalId);
                } catch (error) {}
            }, 5000);
            this.setState({
                networkPollId: intervalId,
            });
        }

        this.setState({
            error: error,
            errorInfo: errorInfo,
            connectionIssue: connectionIssue,
        });
    }

    refreshPage = (): void => {
        window.location.reload();
    };

    clearLocalData = (): void => {
        localStorage.clear();
        this.refreshPage();
    };

    render(): React.ReactNode {
        if (this.state.errorInfo) {
            return (
                <>
                    <Box p={4} display={"flex"} flexDirection={"column"} height={"100vh"}>
                        <Box margin={"auto"}>
                            <Container maxWidth={"sm"}>
                                <Box mb={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <VerbalLogo color={"#121738"} width={"150px"} />
                                </Box>
                                {this.state.connectionIssue &&
                                    this.state.connectionIssue === ConnectionIssueType.Network && (
                                        <>
                                            <Error description={"No network connection"} showImage={false} />
                                            {this.state.networkReconnected && (
                                                <Button
                                                    variant={"contained"}
                                                    size={"large"}
                                                    color={"primary"}
                                                    onClick={this.refreshPage}
                                                >
                                                    Refresh
                                                </Button>
                                            )}
                                        </>
                                    )}
                                {this.state.connectionIssue && this.state.connectionIssue === ConnectionIssueType.Api && (
                                    <>
                                        <Error description={"Verbal API unavailable"} />
                                    </>
                                )}
                                {!this.state.connectionIssue && (
                                    <>
                                        <Error
                                            description={this.state.error ? this.state.error.toString() : undefined}
                                            stack={this.state.errorInfo.componentStack}
                                        />
                                        <Box textAlign={"center"}>
                                            <Button
                                                variant={"contained"}
                                                size={"large"}
                                                color={"primary"}
                                                onClick={this.clearLocalData}
                                            >
                                                Clear ALL your local data
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </Container>
                        </Box>
                    </Box>
                </>
            );
        }
        return this.props.children;
    }
}
