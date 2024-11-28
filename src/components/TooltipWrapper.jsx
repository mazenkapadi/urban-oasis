import React, { useState } from "react";
import { Tooltip } from "@mui/material";

const TooltipWrapper = ({ message, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <Tooltip
            title={message}
            open={open}
            arrow
            onClose={() => setOpen(false)}
            disableHoverListener
        >
            <span onMouseOver={() => setOpen(true)}>{children}</span>
        </Tooltip>
    );
};

export default TooltipWrapper;
