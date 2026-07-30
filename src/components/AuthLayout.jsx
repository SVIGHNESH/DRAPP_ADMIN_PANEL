import React from 'react'
import { Heart } from 'lucide-react'

/**
 * The one layout behind Login, ForgotPassword and ResetPassword.
 *
 * tickets/T07-auth-screens.md settled a single centred card on a plain field
 * rather than a split layout with a brand panel: a brand panel is the one
 * thing on these screens that would have to carry an image or a gradient, and
 * T03 killed every gradient in the app.
 *
 * The mark reads as a lockup above the card rather than the 64px tile the
 * three screens each had. With no sidebar to sit in it is the only brand
 * signal on the page, and at 20px beside the wordmark it says the name without
 * becoming the page's largest element.
 */
const AuthLayout = ({ title, description, children }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-10">
    <div className="w-full max-w-[380px]">
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-xs bg-accent-brand">
          <Heart size={12} className="text-accent-brand-fg" fill="currentColor" />
        </span>
        <span className="text-sm font-semibold text-fg">CareNest</span>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="mb-5">
          <h1 className="text-lg font-semibold text-fg">{title}</h1>
          {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  </div>
)

export default AuthLayout
