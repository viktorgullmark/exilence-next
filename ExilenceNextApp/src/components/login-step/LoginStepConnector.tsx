import { StepConnector, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

export const LoginStepConnector = withStyles((theme: Theme) => {
    const gradient = `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.dark} 100%)`;
    return ({
        alternativeLabel: {
            top: 22,
        },
        active: {
            '& $line': {
                backgroundImage:
                    gradient,
            },
        },
        completed: {
            '& $line': {
                backgroundImage:
                    gradient,
            },
        },
        line: {
            height: 3,
            border: 0,
            backgroundColor: '#eaeaf0',
            borderRadius: 1,
        },
    })
})(StepConnector);