declare module 'react-emoji-flag' {
  import { ComponentType, HTMLAttributes } from 'react';

  interface CountryFlagProps extends HTMLAttributes<HTMLSpanElement> {
    countryCode: string;
    title?: string;
  }

  const CountryFlag: ComponentType<CountryFlagProps>;
  export default CountryFlag;
}

