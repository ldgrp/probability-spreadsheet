type LinkProps = {
  href: string;
  text: string;
};

export const Link = ({ href, text }: LinkProps) => (
  <a className="px-1 border-2 border-dotted hover:underline text-blue-500 " href={href}>
    {text}
  </a>
);
