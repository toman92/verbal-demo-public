import React, { FC } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@material-ui/core";
import clsx from "clsx";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(
    createStyles({
        widget: {
            height: "100%",
            minHeight: "180px",
        },
        widgetInner: {
            display: "flex",
            height: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
        },
        centered: {
            textAlign: "center",
        },
        left: {
            textAlign: "left",
        },
    }),
);

export const HeadlineFigureWidget: FC<{
    header: string;
    centeredHeader?: boolean;
}> = ({ header, children, centeredHeader = true }) => {
    const classes = useStyles();
    return (
        <Grid item xs={12} md={6} lg={3}>
            <Card className={classes.widget}>
                <CardContent className={clsx(classes.widgetInner, centeredHeader ? classes.centered : classes.left)}>
                    <Box>
                        <Typography variant="body2" gutterBottom>
                            {header}
                        </Typography>
                    </Box>
                    {children}
                </CardContent>
            </Card>
        </Grid>
    );
};
