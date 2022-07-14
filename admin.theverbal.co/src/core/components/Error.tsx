import React from "react";
import { Box, Typography, Grid, Container, Paper } from "@material-ui/core";
import errorImage from "../../img/error.svg";

type ErrorProps = {
    error?: string;
    description?: string;
    stack?: string;
    showImage?: boolean;
};

export const Error = (props: ErrorProps): JSX.Element => {
    const { error = "Something went wrong", description, stack, showImage = true } = props;

    return (
        <>
            <Container maxWidth={"sm"}>
                <Box mb={3} alignItems={"center"} justifyContent={"center"} pt={6}>
                    <Grid container wrap="nowrap" spacing={2} justify={"center"} alignItems={"center"}>
                        {showImage && (
                            <Grid item>
                                <Box width={"80px"}>
                                    <img src={errorImage} />
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs>
                            <Typography variant="h3" component={"h1"} gutterBottom>
                                {error}
                            </Typography>
                            {description && <Typography color={"textSecondary"}>{description}</Typography>}
                        </Grid>
                    </Grid>
                </Box>
                {stack && (
                    <Box mb={3}>
                        <Paper>
                            <Box p={3} maxHeight={"300px"} overflow={"auto"}>
                                <Typography variant="body2">{stack}</Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Container>
        </>
    );
};
export default Error;
