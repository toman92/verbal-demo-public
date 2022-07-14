import React from "react";
import { Box, Container, Typography } from "@material-ui/core";

type SimpleBlankSlateProps = {
    image?: React.ReactElement;
    header?: string;
    subHeader?: string;
    content?: string;
    extra?: React.ReactElement;
    actions?: React.ReactElement;
};

export const SimpleBlankSlate = (props: SimpleBlankSlateProps): JSX.Element => {
    const { image, header, subHeader, content, actions, extra } = props;

    return (
        <>
            <Box
                p={3}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                height={1}
            >
                <Container maxWidth={"md"}>
                    <Box mb={2}>{image}</Box>
                    <Box mb={2}>
                        <Typography variant={"h4"}>{header}</Typography>
                        {subHeader && (
                            <Typography variant="body2" gutterBottom>
                                {subHeader}
                            </Typography>
                        )}
                    </Box>
                    <Box mb={2}>
                        <Typography variant={"body1"}>{content}</Typography>
                    </Box>
                    {actions}
                    {extra}
                </Container>
            </Box>
        </>
    );
};
