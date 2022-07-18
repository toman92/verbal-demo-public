import { Box, Button, Container, Grid } from "@material-ui/core";
import { DashboardStats, LastThirtyDays } from "common/build/api-parameters/users";
import React from "react";
import { getStats, getLast30 } from "../../client/api/users";
import { useAuth } from "../../contexts/auth.context";
import { FetchProvider } from "../../contexts/fetch.context";
import { TotalStoriesWidget } from "./widgets/TotalStoriesWidget";
import { StoriesLastMonth } from "./widgets/StoriesLastMonth";

export const Dashboard = (): JSX.Element => {
    const { logout } = useAuth();
    return (
        <Container maxWidth={"md"}>
            <Box pt={3}>
                <FetchProvider<DashboardStats> noun="stats" getItem={getStats} fetchOnload>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TotalStoriesWidget />
                        </Grid>
                    </Grid>
                </FetchProvider>
                <FetchProvider<LastThirtyDays> noun="lastmonth" getItem={getLast30} fetchOnload>
                    <Grid item xs={12}>
                        <StoriesLastMonth />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={() => logout()}>
                            Logout
                        </Button>
                    </Grid>
                </FetchProvider>
            </Box>
        </Container>
    );
};
