import { memo } from "react";

const CommonFooter = memo(() => {
  return (
    <footer className="px-4">
      <p className="mb-0 text-muted">
        Copyright <span>@{new Date().getFullYear()}</span> Developed by{" "}
        <a href="https://smartscripts.tech/" target="_blank" rel="noreferrer">
          Smartscripts Private Limited.
        </a>{" "}
        All Rights Reserved
      </p>
    </footer>
  );
});

CommonFooter.displayName = "CommonFooter";
export default CommonFooter;
