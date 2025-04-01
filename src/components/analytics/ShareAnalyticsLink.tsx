
import { useState } from "react";
import CreateLinkButton from "./share/CreateLinkButton";
import LinkDisplay from "./share/LinkDisplay";

const ShareAnalyticsLink = () => {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);

  const handleLinkCreated = (link: string, id: string) => {
    setShareLink(link);
    setLinkId(id);
  };

  return (
    <div className="space-y-2">
      {!shareLink ? (
        <CreateLinkButton onLinkCreated={handleLinkCreated} />
      ) : (
        <LinkDisplay shareLink={shareLink} />
      )}
      <p className="text-xs text-muted-foreground">
        This link gives your client access to the client hub for 7 days to complete tasks and view their design journey.
      </p>
    </div>
  );
};

export default ShareAnalyticsLink;
