import { createMuiTheme, Theme } from '@material-ui/core';
import { blueGrey, indigo } from '@material-ui/core/colors';
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { fontFamily, maxContentViewportWidth, primaryColor } from './contants';

export const appTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        ...indigo,
        main: primaryColor,
      },
      secondary: blueGrey,
    },
    typography: {
      fontFamily,
    },
  })
);

export const fadeBorder = fade(appTheme.palette.secondary.light, 0.2);
export const headerBorder = fade(appTheme.palette.secondary.light, 0.4);

export const useAppStyles = makeStyles((theme: Theme) => ({
  rootWrapper: {
    maxWidth: '100vw',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  contentWrapper: {
    width: '100vw',
    maxWidth: maxContentViewportWidth,
  },
  sectionBg: {
    backgroundColor: theme.palette.grey['200'],
  },
  headLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    fontWeight: theme.typography.h3.fontWeight,
    fontSize: theme.typography.h3.fontSize,
  },
  noBorder: {
    border: 'none'
  },
  fadeBorder: {
    borderColor: fadeBorder,
  },
  headerBorder: {
    borderColor: headerBorder,
  },
  success: {
    color: theme.palette.success.dark,
  },
}));

export const getAppSpacing = (spacing: number) => appTheme.spacing(spacing);
