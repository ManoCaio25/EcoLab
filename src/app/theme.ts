import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', primary: { main: '#8ee8b6', contrastText: '#112a23' },
    secondary: { main: '#78d5dc' }, background: { default: '#0c171c', paper: '#15252b' },
    text: { primary: '#e7f0ea', secondary: '#97adae' }, divider: 'rgba(183,216,207,0.12)',
  },
  typography: { fontFamily: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 40 } } },
    MuiSwitch: { styleOverrides: { thumb: { boxShadow: 'none' } } },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
});
