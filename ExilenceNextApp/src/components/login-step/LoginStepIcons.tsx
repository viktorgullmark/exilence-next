import { makeStyles, Theme } from '@material-ui/core';
import { StepIconProps } from '@material-ui/core/StepIcon';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import clsx from 'clsx';
import React from 'react';

const useColorlibStepIconStyles = makeStyles((theme: Theme) => {
    const gradient = `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.dark} 100%)`;
    return ({
        root: {
            backgroundColor: '#ccc',
            zIndex: 1,
            color: '#fff',
            width: 50,
            height: 50,
            display: 'flex',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        active: {
            backgroundImage:
                gradient,
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        },
        completed: {
            backgroundImage:
                gradient,
        },
    })
});

export function LoginStepIcons(props: StepIconProps) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <VerifiedUser />,
        2: <PersonIcon />,
        3: <SettingsIcon />
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}