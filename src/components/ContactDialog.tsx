import { ReactNode } from "react";
import { Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { analytics } from "@/lib/analytics";

interface ContactDialogProps {
  trigger: ReactNode;
  emailSubject?: string;
}

const ContactDialog = ({ trigger, emailSubject }: ContactDialogProps) => {
  const email = "kaimyers@alaskapacific.edu";
  const phone = "(916) 955-8064";
  const phoneLink = "tel:+19169558064";

  const handleEmailClick = () => {
    analytics.ctaClicked("contact_email", "contact_dialog");
  };

  const handlePhoneClick = () => {
    analytics.ctaClicked("contact_phone", "contact_dialog");
  };

  const mailtoLink = emailSubject
    ? `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`
    : `mailto:${email}`;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            How would you like to connect?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <a
            href={mailtoLink}
            onClick={handleEmailClick}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Send an Email</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </a>
          <a
            href={phoneLink}
            onClick={handlePhoneClick}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Give Me a Call</p>
              <p className="text-sm text-muted-foreground">{phone}</p>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
