import MuiExpansionPanel from '@mui/material/Accordion';
import MuiExpansionPanelDetails from '@mui/material/AccordionDetails';
import MuiExpansionPanelSummary from '@mui/material/AccordionSummary';
import withStyles from '@mui/styles/withStyles';

export const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

export const AccordionSummary = withStyles((theme) => ({
  root: {
    maxHeight: 40,
    minHeight: '40px !important',
    backgroundColor: theme.palette.secondary.main,
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    '&$expanded': {
      minHeight: 56,
    },
    padding: '0 16px 0 16px',
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
}))(MuiExpansionPanelSummary);

export const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);
