import { Helmet } from "@dr.pogodin/react-helmet";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Recipe Sharing Platform</title>
        <meta
          name="description"
          content="Oops! The page you are looking for doesn’t exist on Recipe Sharing Platform."
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="404 - Page Not Found | Recipe Sharing Platform"
        />
        <meta
          property="og:description"
          content="Oops! The page you are looking for doesn’t exist on Recipe Sharing Platform."
        />
        <meta
          property="og:image"
          content={`${window.location.origin}/assets/food2.png`}
        />
        <meta
          property="og:url"
          content={`${window.location.origin}/not_found`}
        />
        <meta property="og:site_name" content="Recipe Sharing Platform" />
      </Helmet>

      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-muted">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
      </div>
    </>
  );
};

export default NotFound;
