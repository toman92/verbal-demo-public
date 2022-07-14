import { Box, Typography } from "@material-ui/core";
import { DashboardStats } from "common/build/api-parameters/users";
import React from "react";
import { useFetch } from "../../../contexts/fetch.context";
import { HeadlineFigureWidget } from "./HeadlineFigureWidget";

export const TotalStoriesWidget = (): JSX.Element => {
    const { item } = useFetch<DashboardStats>();
    const totalStories = item?.totalStories;

    return (
        <HeadlineFigureWidget header="Total Stories">
            <Box>
                <Typography variant="h2">{totalStories}</Typography>
            </Box>
        </HeadlineFigureWidget>
    );
};
