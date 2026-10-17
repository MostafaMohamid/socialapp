import { Helmet } from 'react-helmet';

export default function PageHelmet({ title, description }) {
  const fullTitle = title ? `${title} | SocialApp` : 'SocialApp';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
    </Helmet>
  );
}
