import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


export default function Test() {
    const locations = ['Cairo,EG', 'London,GB', 'Tokyo,JP'];
    const [selectedLocation, setSelectedLocation] = useState(locations[0]);

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button variant="contained" {...bindTrigger(popupState)}>
                        {selectedLocation}
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                        {locations.map((location) =>
                            <MenuItem
                                key={location}
                                onClick={() => {
                                    setSelectedLocation(location);
                                    popupState.close();
                                }}
                            >
                                {location}
                            </MenuItem>
                        )}
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    )
}
