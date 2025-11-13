interface SocialLinksProps {
  colorClass?: string;
  hoverColorClass?: string;
}

export default function SocialLinks({
  colorClass = "text-primary",
  hoverColorClass = "hover:text-secondary",
}: SocialLinksProps) {
  const linkClass = `${colorClass} ${hoverColorClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-all`;
  return (
    <ul className={`flex gap-4`}>
      <li>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener"
          aria-label="Facebook"
          className={linkClass}
        >
          <span className="sr-only">Facebook</span>
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.592 1.325-1.326V1.326C24 .592 23.405 0 22.675 0"></path>
          </svg>
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener"
          aria-label="Twitter"
          className={linkClass}
        >
          <span className="sr-only">Twitter</span>
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.555-2.005.959-3.127 1.184a4.916 4.916 0 00-8.38 4.482C7.691 8.094 4.066 6.13 1.64 3.161c-.427.733-.666 1.581-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.418A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z"></path>
          </svg>
        </a>
      </li>
      <li>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
          className={linkClass}
        >
          <span className="sr-only">LinkedIn</span>
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76c.97 0 1.75.79 1.75 1.76s-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"></path>
          </svg>
        </a>
      </li>
    </ul>
  );
}
