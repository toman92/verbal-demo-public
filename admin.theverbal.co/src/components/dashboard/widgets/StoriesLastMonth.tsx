import { Box, Typography } from "@material-ui/core";
import { LastThirtyDays } from "common/build/api-parameters/users";
import React from "react";
import { useFetch } from "../../../contexts/fetch.context";
import { HeadlineFigureWidget } from "./HeadlineFigureWidget";

export const StoriesLastMonth = (): JSX.Element => {
    const { item } = useFetch<LastThirtyDays>();
    const pre30DayStories = item?.pre30DayStories;

    return (
        <HeadlineFigureWidget header="Stories Added < 30 Days">
            <Box>
                <Typography variant="h2">{pre30DayStories}</Typography>
            </Box>
        </HeadlineFigureWidget>
    );
};
