enum Opacity {
  opacity100 = 'FF',
  opacity95 = 'F2',
  opacity90 = 'E6',
  opacity80 = 'CC',
  opacity70 = 'B3',
  opacity60 = '99',
  opacity50 = '80',
  opacity40 = '66',
  opacity30 = '4D',
  opacity20 = '33',
  opacity10 = '1A',
  opacity0 = '00',
}

export const AppColors = {
  default: {
    text: {
      light: '#11181C',
      dark: '#ECEDEE',
    },
    background: {
      light: '#fff',
      dark: '#353935',
    },
    link: {
      light: '#0a7ea4',
      dark: '#0a7ea4',
    },
  },
  sheet: {
    handle: {
      light: '#D0D0D0',
      dark: '#3A3A3C',
    },
    background: {
      light: `#ffffff${Opacity.opacity95}`,
      dark: `#353935${Opacity.opacity95}`,
    },
    divider: {
      light: `#E5E7E9${Opacity.opacity95}`,
      dark: `#566573${Opacity.opacity95}`,
    },
  },
};
