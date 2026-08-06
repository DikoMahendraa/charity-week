import type { CSSProperties, JSX } from "react";
import type { Config, Data, RichtextField } from "@puckeditor/core";
import { RichTextMenu } from "@puckeditor/core";

const richtextMenu = () => (
  <RichTextMenu>
    <RichTextMenu.Group>
      <RichTextMenu.HeadingSelect />
    </RichTextMenu.Group>
    <RichTextMenu.Group>
      <RichTextMenu.Bold />
      <RichTextMenu.Italic />
      <RichTextMenu.Underline />
      <RichTextMenu.Strikethrough />
    </RichTextMenu.Group>
    <RichTextMenu.Group>
      <RichTextMenu.ListSelect />
    </RichTextMenu.Group>
  </RichTextMenu>
);

const containerField = {
  type: "radio" as const,
  label: "Block Width",
  options: [
    { value: "container", label: "Container (1024px)" },
    { value: "full", label: "Full Width" },
  ],
};

function wrapContainer(width: string | undefined, content: JSX.Element): JSX.Element {
  if (width === "full") return content;
  return (
    <div style={{ maxWidth: "1024px", margin: "0 auto", width: "100%" }}>
      {content}
    </div>
  );
}

export const EMPTY_DATA: Data = { content: [], root: { props: {} } };

export const puckConfig: Config = {
  components: {

    // ── LAYOUT ──────────────────────────────────────────────────────────────────

    HeroBanner: {
      label: "Hero Banner",
      fields: {
        containerWidth: containerField,
        layout: {
          type: "radio", label: "Layout",
          options: [
            { value: "full", label: "Full Width" },
            { value: "split", label: "Split Column" },
          ],
        },
        heading: { type: "text", label: "Heading" },
        subtext: { type: "textarea", label: "Subtext" },
        ctaButton: { type: "text", label: "CTA Button" },
        ctaHref: { type: "text", label: "CTA Link" },
        backgroundImage: { type: "text", label: "Background Image URL  (full-width)" },
        height: {
          type: "radio", label: "Height  (full-width)",
          options: [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
        align: {
          type: "radio", label: "Text Align  (full-width)",
          options: [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
          ],
        },
        showOverlay: {
          type: "custom", label: "Show overlay  (full-width)",
          render: ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
              Show dark overlay
            </label>
          ),
        },
        mediaType: {
          type: "radio", label: "Media Type  (split)",
          options: [
            { value: "image", label: "Image" },
            { value: "video", label: "YouTube" },
          ],
        },
        mediaSrc: { type: "text", label: "Image URL or YouTube URL  (split)" },
        mediaPosition: {
          type: "radio", label: "Media Side  (split)",
          options: [
            { value: "right", label: "Right" },
            { value: "left", label: "Left" },
          ],
        },
      },
      defaultProps: {
        containerWidth: "container",
        layout: "full",
        heading: "Transform Lives This Summer",
        subtext: "Join the movement and help us provide essential aid to families in need.",
        ctaButton: "Donate Now",
        ctaHref: "/donate",
        backgroundImage: "",
        height: "medium",
        align: "center",
        showOverlay: false,
        mediaType: "image",
        mediaSrc: "",
        mediaPosition: "right",
      },
      render: ({ containerWidth, layout, heading, subtext, ctaButton, ctaHref, backgroundImage, height, align, showOverlay, mediaType, mediaSrc, mediaPosition }) => {
        const textBlock = (extraStyle: CSSProperties = {}) => (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", ...extraStyle }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#161616", marginBottom: "1rem", lineHeight: 1.2 }}>{heading}</h1>
            {subtext && <p style={{ fontSize: "1.125rem", color: "#475467", marginBottom: "2rem", lineHeight: 1.7 }}>{subtext}</p>}
            {(ctaButton && ctaHref) && (
              <div>
                <a href={ctaHref} style={{ display: "inline-block", background: "#EC8900", color: "#fff", padding: "14px 36px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}>
                  {ctaButton}
                </a>
              </div>
            )}
          </div>
        );

        if (layout === "split") {
          const embedSrc = (mediaSrc || "").replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/");
          const mediaBlock = (
            <div style={{ position: "relative", overflow: "hidden", minHeight: "420px" }}>
              {mediaSrc ? (
                mediaType === "video" ? (
                  <iframe src={embedSrc} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
                ) : (
                  <img src={mediaSrc} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "#FEF4E0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: "2rem" }}>{mediaType === "video" ? "▶" : "📷"}</span>
                  <span style={{ fontSize: "0.8rem", color: "#A1A1A1" }}>Add {mediaType === "video" ? "a YouTube URL" : "an image URL"} in the right panel →</span>
                </div>
              )}
            </div>
          );
          return wrapContainer(containerWidth, (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "420px", background: "#fff" }}>
              {mediaPosition === "right" ? <>{textBlock()}{mediaBlock}</> : <>{mediaBlock}{textBlock()}</>}
            </div>
          ));
        }

        const pad = height === "small" ? "48px 40px" : height === "large" ? "120px 40px" : "80px 40px";
        const bg = backgroundImage ? `url(${backgroundImage}) center/cover no-repeat` : "linear-gradient(135deg, #FFF2DF 0%, #FEECD0 100%)";
        return wrapContainer(containerWidth, (
          <div style={{ position: "relative", padding: pad, background: bg, textAlign: align as CSSProperties["textAlign"] }}>
            {showOverlay && backgroundImage && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />}
            <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: align === "center" ? "0 auto" : undefined }}>
              {heading && <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: backgroundImage ? "#fff" : "#161616", marginBottom: "1rem", lineHeight: 1.2 }}>{heading}</h1>}
              {subtext && <p style={{ fontSize: "1.125rem", color: backgroundImage ? "rgba(255,255,255,0.85)" : "#475467", marginBottom: "2rem", lineHeight: 1.7 }}>{subtext}</p>}
              {(ctaButton && ctaHref) && <a href={ctaHref} style={{ display: "inline-block", background: "#EC8900", color: "#fff", padding: "14px 36px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}>{ctaButton}</a>}
            </div>
          </div>
        ));
      },
    },

    CTASection: {
      label: "CTA Section",
      fields: {
        containerWidth: containerField,
        heading: { type: "text", label: "Heading" },
        body: { type: "textarea", label: "Body Text" },
        label: { type: "text", label: "Button Text" },
        href: { type: "text", label: "Button Link" },
        variant: {
          type: "radio", label: "Style",
          options: [
            { value: "orange", label: "Orange" },
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ],
        },
      },
      defaultProps: { containerWidth: "container", heading: "Ready to Make a Difference?", body: "Every donation counts. Help us reach our goal and change more lives.", label: "Donate Now", href: "/donate", variant: "orange" },
      render: ({ containerWidth, heading, body, label, href, variant }) => {
        const bg = variant === "dark" ? "#1C1C1C" : variant === "light" ? "#F7F9FB" : "#EC8900";
        const text = variant === "light" ? "#161616" : "#fff";
        const sub = variant === "light" ? "#475467" : "rgba(255,255,255,0.85)";
        const btnBg = variant === "light" ? "#EC8900" : "#fff";
        const btnTxt = variant === "light" ? "#fff" : "#EC8900";
        return wrapContainer(containerWidth, (
          <div style={{ padding: "64px 40px", background: bg, textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: text, marginBottom: "1rem" }}>{heading}</h2>
            <p style={{ fontSize: "1rem", color: sub, maxWidth: 560, margin: "0 auto 2rem" }}>{body}</p>
            <a href={href} style={{ display: "inline-block", background: btnBg, color: btnTxt, padding: "14px 40px", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>{label}</a>
          </div>
        ));
      },
    },

    TwoColumnCards: {
      label: "Two-Column Cards",
      fields: {
        containerWidth: containerField,
        leftHeading: { type: "text", label: "Left Heading" },
        leftBody: { type: "textarea", label: "Left Body" },
        leftImage: { type: "text", label: "Left Image URL" },
        rightHeading: { type: "text", label: "Right Heading" },
        rightBody: { type: "textarea", label: "Right Body" },
        rightImage: { type: "text", label: "Right Image URL" },
      },
      defaultProps: { containerWidth: "container", leftHeading: "Our Story", leftBody: "Founded in 2003, Charity Week has grown into one of the largest student-led charity campaigns in the UK.", leftImage: "", rightHeading: "Our Impact", rightBody: "Over £30 million raised for orphans and vulnerable children across 30+ countries.", rightImage: "" },
      render: ({ containerWidth, leftHeading, leftBody, leftImage, rightHeading, rightBody, rightImage }) => wrapContainer(containerWidth, (
        <div style={{ padding: "48px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {[{ heading: leftHeading, body: leftBody, image: leftImage }, { heading: rightHeading, body: rightBody, image: rightImage }].map(({ heading, body, image }, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                {image ? <img src={image} alt={heading} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                  : <div style={{ height: "180px", background: "#FEF4E0", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "2rem" }}>📷</span></div>}
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#161616", marginBottom: "0.5rem" }}>{heading}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#475467", lineHeight: 1.7 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )),
    },

    TwoPanelRichText: {
      label: "Two-Panel Rich Text",
      fields: {
        containerWidth: containerField,
        background: {
          type: "radio", label: "Background",
          options: [{ value: "cream", label: "Cream" }, { value: "white", label: "White" }, { value: "light", label: "Light Grey" }],
        },
        leftEmoji: { type: "text", label: "Left Icon (emoji)" },
        leftHeading: { type: "text", label: "Left Heading" },
        leftBody: { type: "richtext", label: "Left Body", renderMenu: richtextMenu } as RichtextField,
        rightEmoji: { type: "text", label: "Right Icon (emoji)" },
        rightHeading: { type: "text", label: "Right Heading" },
        rightBody: { type: "richtext", label: "Right Body", renderMenu: richtextMenu } as RichtextField,
      },
      defaultProps: {
        containerWidth: "container",
        background: "cream",
        leftEmoji: "🏆",
        leftHeading: "Prizes",
        leftBody: "<p><strong>ISOC Fundraisers!</strong></p><ul><li>1st place to receive £1,500</li><li>2nd place to receive £1,000</li><li>3rd place to receive £500</li></ul><p><strong>Organizations and Individuals</strong><br>(Businesses, Masjids, Families)</p><ul><li>1st place to receive £1,500</li><li>2nd place to receive £1,000</li><li>3rd place to receive £500</li></ul>",
        rightEmoji: "📋",
        rightHeading: "Rules",
        rightBody: "<p><strong>Qualifying donations</strong>: Online donations only. Donations cannot be refunded after winning.</p><p><strong>Payout Currency</strong>: Prizes are always paid in USD ($)</p><p><strong>Timeframe</strong>: All qualifying donations must be made before <strong>7th November, 11:59pm GMT.</strong></p>",
      },
      render: ({ containerWidth, background, leftEmoji, leftHeading, leftBody, rightEmoji, rightHeading, rightBody }) => {
        const bg = background === "white" ? "#ffffff" : background === "light" ? "#F7F9FB" : "#FFF8EE";
        const panels = [
          { emoji: leftEmoji, heading: leftHeading, body: leftBody },
          { emoji: rightEmoji, heading: rightHeading, body: rightBody },
        ];
        return wrapContainer(containerWidth, (
          <div style={{ padding: "48px 40px" }}>
            <div style={{ background: bg, borderRadius: "16px", padding: "36px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
              {panels.map(({ emoji, heading, body }, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                    <span style={{ fontSize: "1.75rem" }}>{emoji}</span>
                    <h3 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#161616", margin: 0 }}>{heading}</h3>
                  </div>
                  {typeof body === "string"
                    ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: body }} style={{ fontSize: "0.9375rem", color: "#344054", lineHeight: 1.75 }} />
                    : <div className="rich-text" style={{ fontSize: "0.9375rem", color: "#344054", lineHeight: 1.75 }}>{body}</div>
                  }
                </div>
              ))}
            </div>
          </div>
        ));
      },
    },

    Navbar: {
      label: "Navbar",
      fields: {
        containerWidth: containerField,
        logo: { type: "text", label: "Logo Text" },
        logoImage: { type: "text", label: "Logo Image URL" },
        navLinks: {
          type: "array", label: "Nav Links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "URL" },
          },
          defaultItemProps: { label: "Link", href: "/" },
        },
        ctaLabel: { type: "text", label: "CTA Button Text" },
        ctaHref: { type: "text", label: "CTA Button Link" },
        background: {
          type: "radio", label: "Background",
          options: [
            { value: "white", label: "White" },
            { value: "dark", label: "Dark" },
            { value: "transparent", label: "Transparent" },
          ],
        },
      },
      defaultProps: {
        containerWidth: "full",
        logo: "IRUK",
        logoImage: "",
        navLinks: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Donate", href: "/donate" },
          { label: "Contact", href: "/contact" },
        ],
        ctaLabel: "Donate Now",
        ctaHref: "/donate",
        background: "white",
      },
      render: ({ containerWidth, logo, logoImage, navLinks, ctaLabel, ctaHref, background }) => {
        const isDark = background === "dark";
        const bg = isDark ? "#1C1C1C" : background === "transparent" ? "transparent" : "#fff";
        const border = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #F1F1F1";
        const linkClr = isDark ? "rgba(255,255,255,0.75)" : "#475467";
        return wrapContainer(containerWidth, (
          <nav style={{ background: bg, borderBottom: border, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              {logoImage
                ? <img src={logoImage} alt={logo} style={{ height: "36px", objectFit: "contain", display: "block" }} />
                : <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#EC8900" }}>{logo}</span>
              }
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {(navLinks as { label: string; href: string }[] || []).map((link, i) => (
                <a key={i} href={link.href} style={{ fontSize: "0.875rem", fontWeight: 500, color: linkClr, textDecoration: "none", padding: "6px 12px", borderRadius: "6px" }}>
                  {link.label}
                </a>
              ))}
            </div>
            {ctaLabel && (
              <a href={ctaHref} style={{ display: "inline-block", background: "#EC8900", color: "#fff", padding: "10px 24px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "0.875rem", flexShrink: 0 }}>
                {ctaLabel}
              </a>
            )}
          </nav>
        ));
      },
    },

    Footer: {
      label: "Footer",
      fields: {
        containerWidth: containerField,
        orgName: { type: "text", label: "Organization Name" },
        description: { type: "textarea", label: "Description" },
        col1Title: { type: "text", label: "Column 1 Title" },
        col1Links: {
          type: "array", label: "Column 1 Links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "URL" },
          },
          defaultItemProps: { label: "Link", href: "/" },
        },
        col2Title: { type: "text", label: "Column 2 Title" },
        col2Links: {
          type: "array", label: "Column 2 Links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "URL" },
          },
          defaultItemProps: { label: "Link", href: "/" },
        },
        socialFacebook: { type: "text", label: "Facebook URL" },
        socialInstagram: { type: "text", label: "Instagram URL" },
        socialTwitter: { type: "text", label: "X / Twitter URL" },
        copyright: { type: "text", label: "Copyright Text" },
        background: {
          type: "radio", label: "Background",
          options: [
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ],
        },
      },
      defaultProps: {
        containerWidth: "full",
        orgName: "IRUK Charity Week",
        description: "Transforming lives through the power of community fundraising since 2003.",
        col1Title: "Organisation",
        col1Links: [
          { label: "About Us", href: "/about" },
          { label: "Our Impact", href: "/impact" },
          { label: "How It Works", href: "/how-it-works" },
        ],
        col2Title: "Get Involved",
        col2Links: [
          { label: "Donate", href: "/donate" },
          { label: "Fundraise", href: "/fundraise" },
          { label: "Contact Us", href: "/contact" },
        ],
        socialFacebook: "",
        socialInstagram: "",
        socialTwitter: "",
        copyright: "© 2024 Islamic Relief UK. All rights reserved.",
        background: "dark",
      },
      render: ({ containerWidth, orgName, description, col1Title, col1Links, col2Title, col2Links, socialFacebook, socialInstagram, socialTwitter, copyright, background }) => {
        const isDark = background !== "light";
        const bg = isDark ? "#1C1C1C" : "#F7F9FB";
        const text = isDark ? "#fff" : "#161616";
        const sub = isDark ? "rgba(255,255,255,0.5)" : "#6B7280";
        const linkClr = isDark ? "rgba(255,255,255,0.7)" : "#475467";
        const divider = isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB";
        const socials = [
          { href: socialFacebook, char: "f" },
          { href: socialInstagram, char: "ig" },
          { href: socialTwitter, char: "x" },
        ].filter(s => s.href);
        return wrapContainer(containerWidth, (
          <footer style={{ background: bg, color: text, padding: "56px 40px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px", paddingBottom: "48px", borderBottom: `1px solid ${divider}` }}>
              {/* Brand */}
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#EC8900", marginBottom: "12px" }}>{orgName}</div>
                <p style={{ fontSize: "0.875rem", color: sub, lineHeight: 1.8, maxWidth: "320px" }}>{description}</p>
                {socials.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                    {socials.map((s, i) => (
                      <a key={i} href={s.href} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "8px", background: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB", color: text, textDecoration: "none", fontSize: "0.7rem", fontWeight: 700 }}>
                        {s.char}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {/* Link columns */}
              {([{ title: col1Title, links: col1Links }, { title: col2Title, links: col2Links }] as { title: string; links: { label: string; href: string }[] }[]).map(({ title, links }, i) => (
                <div key={i}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as CSSProperties["textTransform"], letterSpacing: "0.08em", color: sub, marginBottom: "16px" }}>{title}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(links || []).map((link, j) => (
                      <a key={j} href={link.href} style={{ fontSize: "0.875rem", color: linkClr, textDecoration: "none" }}>{link.label}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 0", textAlign: "center" as CSSProperties["textAlign"] }}>
              <p style={{ fontSize: "0.75rem", color: sub }}>{copyright}</p>
            </div>
          </footer>
        ));
      },
    },

    // ── CONTENT ─────────────────────────────────────────────────────────────────

    DonationWidget: {
      label: "Donation Widget",
      fields: {
        containerWidth: containerField,
        heading: { type: "text", label: "Heading" },
        goalAmount: { type: "text", label: "Goal Amount" },
        raisedAmount: { type: "text", label: "Amount Raised" },
        donorsCount: { type: "text", label: "Donors Count" },
        ctaLabel: { type: "text", label: "Button Label" },
        ctaHref: { type: "text", label: "Button Link" },
      },
      defaultProps: { containerWidth: "container", heading: "Help Us Reach Our Goal", goalAmount: "100,000", raisedAmount: "67,450", donorsCount: "1,243", ctaLabel: "Donate Now", ctaHref: "/donate" },
      render: ({ containerWidth, heading, goalAmount, raisedAmount, donorsCount, ctaLabel, ctaHref }) => {
        const goal = parseFloat((goalAmount || "100000").replace(/,/g, "")) || 100000;
        const raised = parseFloat((raisedAmount || "0").replace(/,/g, "")) || 0;
        const pct = Math.min(100, Math.round((raised / goal) * 100));
        return wrapContainer(containerWidth, (
          <div style={{ padding: "48px 40px" }}>
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#161616", marginBottom: "1.5rem" }}>{heading}</h2>
              <div style={{ background: "#F7F9FB", borderRadius: "12px", padding: "28px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.875rem", color: "#475467" }}>Raised: <strong style={{ color: "#EC8900" }}>${raisedAmount}</strong></span>
                  <span style={{ fontSize: "0.875rem", color: "#475467" }}>Goal: <strong>${goalAmount}</strong></span>
                </div>
                <div style={{ height: "10px", background: "#E5E7EB", borderRadius: "99px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "#EC8900", borderRadius: "99px" }} />
                </div>
                <p style={{ fontSize: "0.8rem", color: "#A1A1A1", marginBottom: "20px" }}>{pct}% of goal · {donorsCount} donors</p>
                <a href={ctaHref} style={{ display: "inline-block", background: "#EC8900", color: "#fff", padding: "14px 40px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}>{ctaLabel}</a>
              </div>
            </div>
          </div>
        ));
      },
    },

    ImpactStories: {
      label: "Impact Stories",
      fields: {
        containerWidth: containerField,
        heading: { type: "text", label: "Section Heading" },
        story1Title: { type: "text", label: "Story 1 Title" },
        story1Body: { type: "textarea", label: "Story 1 Body" },
        story1Image: { type: "text", label: "Story 1 Image URL" },
        story2Title: { type: "text", label: "Story 2 Title" },
        story2Body: { type: "textarea", label: "Story 2 Body" },
        story2Image: { type: "text", label: "Story 2 Image URL" },
        story3Title: { type: "text", label: "Story 3 Title" },
        story3Body: { type: "textarea", label: "Story 3 Body" },
        story3Image: { type: "text", label: "Story 3 Image URL" },
      },
      defaultProps: { containerWidth: "container", heading: "Stories of Impact", story1Title: "A New Beginning", story1Body: "Thanks to your generosity, Ahmed now attends school and dreams of becoming a doctor.", story1Image: "", story2Title: "Safe & Warm", story2Body: "The Al-Rashidi family received emergency housing support during the winter months.", story2Image: "", story3Title: "Learning to Hope", story3Body: "Fatima's scholarship has transformed her family's future for generations to come.", story3Image: "" },
      render: ({ containerWidth, heading, story1Title, story1Body, story1Image, story2Title, story2Body, story2Image, story3Title, story3Body, story3Image }) => {
        const stories = [{ title: story1Title, body: story1Body, image: story1Image }, { title: story2Title, body: story2Body, image: story2Image }, { title: story3Title, body: story3Body, image: story3Image }];
        return wrapContainer(containerWidth, (
          <div style={{ padding: "48px 40px", background: "#F7F9FB" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#161616", textAlign: "center", marginBottom: "2rem" }}>{heading}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {stories.map(({ title, body, image }, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  {image ? <img src={image} alt={title} style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
                    : <div style={{ height: "160px", background: "#FEF4E0" }} />}
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#161616", marginBottom: "6px" }}>{title}</h3>
                    <p style={{ fontSize: "0.875rem", color: "#475467", lineHeight: 1.6 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ));
      },
    },

    FAQSection: {
      label: "FAQ Section",
      fields: {
        containerWidth: containerField,
        heading: { type: "text", label: "Section Heading" },
        q1: { type: "text", label: "Question 1" }, a1: { type: "textarea", label: "Answer 1" },
        q2: { type: "text", label: "Question 2" }, a2: { type: "textarea", label: "Answer 2" },
        q3: { type: "text", label: "Question 3" }, a3: { type: "textarea", label: "Answer 3" },
        q4: { type: "text", label: "Question 4" }, a4: { type: "textarea", label: "Answer 4" },
      },
      defaultProps: { containerWidth: "container", heading: "Frequently Asked Questions", q1: "How is my donation used?", a1: "100% of your donation goes directly to supporting orphans and vulnerable children through our vetted partners.", q2: "Is my donation tax-deductible?", a2: "Yes, IRUK is a registered charity and all donations are eligible for Gift Aid in the UK.", q3: "Can I fundraise on behalf of an institution?", a3: "Absolutely. Register your institution through our campaign portal and start raising funds today.", q4: "How do I track the impact of my donation?", a4: "We send regular impact reports to all donors, including stories and metrics from the ground." },
      render: ({ containerWidth, heading, q1, a1, q2, a2, q3, a3, q4, a4 }) => {
        const items = [{ q: q1, a: a1 }, { q: q2, a: a2 }, { q: q3, a: a3 }, { q: q4, a: a4 }].filter(({ q }) => q);
        return wrapContainer(containerWidth, (
          <div style={{ padding: "48px 40px", maxWidth: "720px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#161616", marginBottom: "1.5rem", textAlign: "center" }}>{heading}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(({ q, a }, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: "10px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft: "3px solid #EC8900" }}>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "#161616", marginBottom: "6px" }}>{q}</p>
                  <p style={{ fontSize: "0.9rem", color: "#475467", lineHeight: 1.7 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        ));
      },
    },

    RichTextBlock: {
      label: "Rich Text Block",
      fields: {
        containerWidth: containerField,
        heading: { type: "text", label: "Heading (optional)" },
        body: { type: "richtext", label: "Body Content", renderMenu: richtextMenu } as RichtextField,
        align: {
          type: "radio", label: "Alignment",
          options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }],
        },
      },
      defaultProps: { containerWidth: "container", heading: "Our Commitment", body: "<p>We are committed to transparency, accountability, and delivering maximum impact with every donation received.</p>", align: "left" },
      render: ({ containerWidth, heading, body, align }) => {
        const bodyStyle: CSSProperties = { fontSize: "1rem", color: "#475467", lineHeight: 1.8 };
        return wrapContainer(containerWidth, (
          <div style={{ padding: "48px 40px", textAlign: align as CSSProperties["textAlign"] }}>
            {heading && <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#161616", marginBottom: "1rem" }}>{heading}</h2>}
            {typeof body === "string"
              ? <div className="rich-text" dangerouslySetInnerHTML={{ __html: body }} style={bodyStyle} />
              : <div className="rich-text" style={bodyStyle}>{body}</div>
            }
          </div>
        ));
      },
    },

    // ── MEDIA ────────────────────────────────────────────────────────────────────

    ImageGallery: {
      label: "Image Gallery",
      fields: {
        containerWidth: containerField,
        caption: { type: "text", label: "Caption (optional)" },
        img1: { type: "text", label: "Image 1 URL" },
        img2: { type: "text", label: "Image 2 URL" },
        img3: { type: "text", label: "Image 3 URL" },
      },
      defaultProps: { containerWidth: "container", caption: "", img1: "", img2: "", img3: "" },
      render: ({ containerWidth, caption, img1, img2, img3 }) => wrapContainer(containerWidth, (
        <div style={{ padding: "0 40px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[img1, img2, img3].map((src, i) =>
              src ? <img key={i} src={src} alt="" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                : <div key={i} style={{ height: "180px", background: "#F7F9FB", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #E5E7EB", color: "#A1A1A1", fontSize: "0.75rem" }}>Image {i + 1}</div>
            )}
          </div>
          {caption && <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#A1A1A1", marginTop: "10px" }}>{caption}</p>}
        </div>
      )),
    },

    VideoEmbed: {
      label: "Video Embed",
      fields: {
        containerWidth: containerField,
        videoUrl: { type: "text", label: "YouTube / Vimeo URL" },
        caption: { type: "text", label: "Caption (optional)" },
        aspectRatio: {
          type: "radio", label: "Aspect Ratio",
          options: [{ value: "16/9", label: "16:9" }, { value: "4/3", label: "4:3" }],
        },
      },
      defaultProps: { containerWidth: "container", videoUrl: "", caption: "", aspectRatio: "16/9" },
      render: ({ containerWidth, videoUrl, caption, aspectRatio }) => {
        const embedUrl = videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/");
        return wrapContainer(containerWidth, (
          <div style={{ padding: "0 40px 40px" }}>
            {videoUrl ? (
              <div style={{ position: "relative", paddingTop: aspectRatio === "4/3" ? "75%" : "56.25%", borderRadius: "12px", overflow: "hidden" }}>
                <iframe src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
              </div>
            ) : (
              <div style={{ height: "240px", background: "#1C1C1C", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: "2rem" }}>▶</span>
                <span style={{ fontSize: "0.875rem", color: "#A1A1A1" }}>Add a YouTube or Vimeo URL in the right panel</span>
              </div>
            )}
            {caption && <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#A1A1A1", marginTop: "10px" }}>{caption}</p>}
          </div>
        ));
      },
    },

    // ── SIMPLE FOOTER ────────────────────────────────────────────────────────────

    SimpleFooter: {
      label: "Simple Footer",
      fields: {
        containerWidth: containerField,
        poweredByLabel: { type: "text", label: "Powered By Label" },
        brandName: { type: "text", label: "Brand Name" },
        copyright: { type: "text", label: "Copyright Text" },
        background: {
          type: "radio", label: "Background",
          options: [
            { value: "dark", label: "Dark" },
            { value: "blue", label: "Blue" },
            { value: "orange", label: "Orange" },
          ],
        },
      },
      defaultProps: {
        containerWidth: "full",
        poweredByLabel: "Powered by",
        brandName: "IRUK Charity Week",
        copyright: "© 2025 Islamic Relief UK. All rights reserved. Registered Charity No. 328158",
        background: "dark",
      },
      render: ({ containerWidth, poweredByLabel, brandName, copyright, background }) => {
        const bg = background === "blue" ? "#3B6FCA" : background === "orange" ? "#EC8900" : "#1A1A2E";
        return wrapContainer(containerWidth, (
          <footer style={{ background: bg, padding: "36px 40px 28px", textAlign: "center" as CSSProperties["textAlign"] }}>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", marginBottom: "6px", letterSpacing: "0.02em" }}>
              {poweredByLabel}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                {brandName}
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", maxWidth: "560px", margin: "0 auto" }}>
              {copyright}
            </p>
          </footer>
        ));
      },
    },

    // ── STATS BAR ────────────────────────────────────────────────────────────────

    StatsBar: {
      label: "Stats Bar",
      fields: {
        containerWidth: containerField,
        background: {
          type: "radio", label: "Background",
          options: [
            { value: "dark", label: "Dark" },
            { value: "orange", label: "Orange" },
            { value: "light", label: "Light" },
          ],
        },
        mainValue: { type: "text", label: "Main Stat Value" },
        mainLabel: { type: "text", label: "Main Stat Label" },
        stat1Value: { type: "text", label: "Stat 1 Value" },
        stat1Label: { type: "text", label: "Stat 1 Label" },
        stat2Value: { type: "text", label: "Stat 2 Value" },
        stat2Label: { type: "text", label: "Stat 2 Label" },
        stat3Value: { type: "text", label: "Stat 3 Value (optional)" },
        stat3Label: { type: "text", label: "Stat 3 Label (optional)" },
      },
      defaultProps: {
        containerWidth: "container",
        background: "dark",
        mainValue: "£240,308 GBP",
        mainLabel: "Funds raised",
        stat1Value: "6,788",
        stat1Label: "Donors",
        stat2Value: "509",
        stat2Label: "Fundraisers",
        stat3Value: "",
        stat3Label: "",
      },
      render: ({ containerWidth, background, mainValue, mainLabel, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label }) => {
        const bg = background === "orange" ? "#EC8900" : background === "light" ? "#F7F9FB" : "#1A1A2E";
        const text = background === "light" ? "#161616" : "#fff";
        const subtext = background === "light" ? "#6B7280" : "rgba(255,255,255,0.6)";
        const sideStats = [
          { value: stat1Value, label: stat1Label },
          stat3Value ? { value: stat3Value, label: stat3Label } : null,
          { value: stat2Value, label: stat2Label },
        ].filter(Boolean) as { value: string; label: string }[];

        return wrapContainer(containerWidth, (
          <div style={{ background: bg, padding: "48px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <p style={{ fontSize: "3rem", fontWeight: 900, color: text, lineHeight: 1.1, margin: 0 }}>{mainValue}</p>
              <p style={{ fontSize: "0.875rem", color: subtext, marginTop: "6px" }}>{mainLabel}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "700px", margin: "0 auto" }}>
              {sideStats.map((s, i) => (
                <div key={i} style={{ textAlign: i === 1 ? "center" : i === 0 ? "left" : "right" }}>
                  <p style={{ fontSize: "2rem", fontWeight: 900, color: text, margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: "0.8rem", color: subtext, marginTop: "4px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        ));
      },
    },

    // ── IMAGE TEXT SECTION ────────────────────────────────────────────────────────

    ImageTextSection: {
      label: "Image + Text Section",
      fields: {
        containerWidth: containerField,
        imageUrl: { type: "text", label: "Image URL" },
        imagePosition: {
          type: "radio", label: "Image Side",
          options: [{ value: "left", label: "Left" }, { value: "right", label: "Right" }],
        },
        heading: { type: "text", label: "Heading" },
        body: { type: "textarea", label: "Body Text (paragraphs separated by blank line)" },
        ctaLabel: { type: "text", label: "CTA Button Label" },
        ctaHref: { type: "text", label: "CTA Button URL" },
        ctaStyle: {
          type: "radio", label: "CTA Style",
          options: [
            { value: "filled", label: "Filled" },
            { value: "outline", label: "Outline" },
            { value: "none", label: "None" },
          ],
        },
        background: {
          type: "radio", label: "Background",
          options: [
            { value: "white", label: "White" },
            { value: "light", label: "Light grey" },
          ],
        },
      },
      defaultProps: {
        containerWidth: "container",
        imageUrl: "",
        imagePosition: "left",
        heading: "Choose the projects for this year!",
        body: "In Charity Week, we work together so instead of funding just one project, the unity of the thousands of participants around the world allows for us to fund a range of projects.\n\nThe choice of what projects will be funded is in the hands of all of you who raise funds for Orphans and Children in Need. Fill out the survey from the link below to have your say!",
        ctaLabel: "Project survey",
        ctaHref: "#",
        ctaStyle: "filled",
        background: "white",
      },
      render: ({ containerWidth, imageUrl, imagePosition, heading, body, ctaLabel, ctaHref, ctaStyle, background }) => {
        const bg = background === "light" ? "#F7F9FB" : "#fff";
        const btnStyle: CSSProperties =
          ctaStyle === "outline"
            ? { background: "transparent", color: "#EC8900", border: "2px solid #EC8900", padding: "12px 28px", borderRadius: "99px", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem", display: "inline-block" }
            : { background: "#EC8900", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "99px", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem", display: "inline-block" };

        const paragraphs = (body || "").split(/\n\n+/).filter(Boolean);

        const imageBlock = (
          <div style={{ flex: "0 0 45%", borderRadius: "12px", overflow: "hidden", minHeight: "320px", background: "#FEF4E0" }}>
            {imageUrl
              ? <img src={imageUrl} alt={heading} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "320px" }} />
              : <div style={{ width: "100%", height: "320px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: "2.5rem" }}>📷</span>
                <span style={{ fontSize: "0.8rem", color: "#A1A1A1" }}>Add an image URL in the right panel →</span>
              </div>
            }
          </div>
        );

        const textBlock = (
          <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#161616", marginBottom: "1.25rem", lineHeight: 1.3 }}>{heading}</h2>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: "0.95rem", color: "#475467", lineHeight: 1.8, marginBottom: "1rem" }}>{p}</p>
            ))}
            {ctaStyle !== "none" && ctaLabel && (
              <div style={{ marginTop: "0.5rem" }}>
                <a href={ctaHref} style={btnStyle}>{ctaLabel}</a>
              </div>
            )}
          </div>
        );

        return wrapContainer(containerWidth, (
          <div style={{ background: bg, padding: "64px 40px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "64px", alignItems: "center", flexWrap: "wrap" }}>
              {imagePosition === "left" ? <>{imageBlock}{textBlock}</> : <>{textBlock}{imageBlock}</>}
            </div>
          </div>
        ));
      },
    },
  },
};
