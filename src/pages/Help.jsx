import React from "react"
import { Mail, Phone } from "lucide-react"

import PageHeader from "../components/PageHeader"
import { Card } from "@/components/ui/card"

// The two contact routes. The 60 lines of commented-out earlier drafts that
// used to sit above this, including a live-chat card wired to nothing and a
// FAQ block referencing a location-tracking feature that does not exist, are
// gone. So is the newline that had crept inside the mailto href, which made
// the link resolve to "rbcetsdc@rbmi.in%0A".
const channels = [
  {
    icon: Phone,
    title: "Support Contact Number",
    description: "Call us anytime for urgent help",
    value: "+919690647600",
    href: "tel:+919690647600",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get a response within 24 hours",
    value: "rbcetsdc@rbmi.in",
    href: "mailto:rbcetsdc@rbmi.in",
  },
]

const Help = () => (
  <>
    <PageHeader title="Help & Support" description="We are here to help you anytime" />

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {channels.map(({ icon: Icon, title, description, value, href }) => (
        <Card key={title} className="p-4">
          <div className="flex items-center gap-2 text-fg-muted">
            <Icon size={14} className="shrink-0" />
            <h2 className="text-xs font-medium">{title}</h2>
          </div>
          <a
            href={href}
            className="mt-2 inline-block rounded-xs text-lg font-medium text-accent-text outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {value}
          </a>
          <p className="mt-1 text-xs text-fg-muted">{description}</p>
        </Card>
      ))}
    </div>
  </>
)

export default Help
