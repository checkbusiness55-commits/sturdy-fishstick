import * as React from "react"

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
      <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-lg p-6 max-w-sm w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export { Dialog }