import { Link, useLocation } from 'react-router-dom';


function AuthLink({ message, linkText, linkHref }) {
  return (
    <p className="mt-6 text-center text-sm text-neutral-500">
      {message}{' '}
      <Link to={linkHref} className={"underline text-blue-600 hover:text-blue-800"}>
        {linkText}
      </Link>
    </p>
  );
}

export default AuthLink;
