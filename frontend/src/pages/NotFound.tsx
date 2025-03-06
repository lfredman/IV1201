/**
 * `NotFound` Component
 * 
 * The `NotFound` component is a simple page that is displayed when a user navigates to a route that does not exist in the application.
 * It serves as a 404 error page, indicating that the requested page is unavailable.
 * 
 * - It renders a message: "404 - Page Not Found" to inform the user that the page they are looking for cannot be found.
 * 
 * @returns {JSX.Element} The rendered JSX element showing a 404 error message.
 */
const NotFound: React.FC = () => {
    return <h1>404 - Page Not Found</h1>;
  };
  
  export default NotFound;