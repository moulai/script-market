import { ThemeConfig } from 'antd';

/**
 * 自定义主题配置
 */
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Form: {
      labelFontSize: 14,
    },
    Button: {
      primaryColor: '#1677ff',
    },
    Card: {
      borderRadiusLG: 8,
    },
  },
};

export default theme; 