import {
  useFloating,
  autoPlacement,
  useHover,
  safePolygon,
  useInteractions,
} from "@floating-ui/react";
import { Popover } from "@headlessui/react";
import { useState } from "react";

type HelpIconProps = {
  children: React.ReactNode;
  helpFor: string;
};

export const HelpIcon = ({ children, helpFor }: HelpIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      autoPlacement({
        alignment: "start",
      }),
    ],
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const hover = useHover(context, {
    handleClose: safePolygon(),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <Popover className="leading-4 ml-auto">
      <Popover.Button ref={refs.setReference} {...getFloatingProps()}>
        <svg
          className="w-4 h-4 text-gray-400 hover:text-gray-500"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Show help for {helpFor}</span>
      </Popover.Button>
      {isOpen && (
        <Popover.Panel ref={refs.setFloating} style={floatingStyles} static>
          <div className="ml-2 w-64 inline-block text-gray-600 text-sm bg-white border border-gray-200 rounded-lg shadow-sm">
            {children}
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
};
