import React, { FC } from "react";
import { Permission } from "common/build/prisma/client";
import { useAuth } from "../../contexts/auth.context";

export const HasPermission: FC<{ permission: Permission }> = ({ permission, children }) => (
    <>{useAuth().hasPermission(permission) ? children : null}</>
);
