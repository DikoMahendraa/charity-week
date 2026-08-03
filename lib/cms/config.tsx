import type { CSSProperties } from "react";
import type { Config, Data } from "@puckeditor/core";

export const EMPTY_DATA: Data = { content: [], root: { props: {} } };

export const puckConfig: Config = {
  components: {

    // ── LAYOUT ──────────────────────────────────────────────────────────────────

    HeroBanner: {
      label: "Hero Banner",
      fields: {
        layout: {
          type: "radio", label: "Layout",
          options: [
            { value: "full",  label: "Full Width"   },
            { value: "split", label: "Split Column" },
          ],
        },
        heading:   { type: "text",     label: "Heading"    },
        subtext:   { type: "textarea", label: "Subtext"    },
        ctaButton: { type: "text",     label: "CTA Button" },
        ctaHref:   { type: "text",     label: "CTA Link"   },
        backgroundImage: { type: "text", label: "Background Image URL  (full-width)" },
        height: {
          type: "radio", label: "Height  (full-width)",
          options: [
            { value: "small",  label: "Small"  },
            { value: "medium", label: "Medium" },
            { value: "large",  label: "Large"  },
          ],
        },
        align: {
          type: "radio", label: "Text Align  (full-width)",
          options: [
            { value: "left",   label: "Left"   },
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
            { value: "image", label: "Image"   },
            { value: "video", label: "YouTube" },
          ],
        },
        mediaSrc:      { type: "text", label: "Image URL or YouTube URL  (split)" },
        mediaPosition: {
          type: "radio", label: "Media Side  (split)",
          options: [
            { value: "right", label: "Right" },
            { value: "left",  label: "Left"  },
          ],
        },
      },
      defaultProps: {
        layout: "full",
        heading: "Transform Lives This Summer",
        subtext: "Join the movement and help us provide essential aid to families in need.",
        ctaButton: "Donate Now",
        ctaHref: "/donate",
        backgroundImage: "",
        height: "medium",
        align: "center",
        showOverlay: true,
        mediaType: "image",
        mediaSrc: "",
        mediaPosition: "right",
      },
      render: ({ layout, heading, subtext, ctaButton, ctaHref, backgroundImage, height, align, showOverlay, mediaType, mediaSrc, mediaPosition }) => {
        const textBlock = (extraStyle: CSSProperties = {}) => (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", ...extraStyle }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#161616", marginBottom: "1rem", lineHeight: 1.2 }}>{heading}</h1>
            <p style={{ fontSize: "1.125rem", color: "#475467", marginBottom: "2rem", lineHeight: 1.7 }}>{subtext}</p>
            <div>
              <a href={ctaHref} style={{ display: "inline-block", background: "#EC8900", color: "#fff", padding: "14px 36px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}>
                {ctaButton}
              </a>
            </div>
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
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "420px", background: "#fff" }}>
              {mediaPosition === "right" ? <>{textBlock()}{mediaBlock}</> : <>{mediaBlock}{textBlock()}</>}
            </div>
          );
        }

        const pad = height === "small" ? "48px 40px" : height === "large" ? "120px 40px" : "80px 40px";
        const bg  = backgroundImage ? `url(${backgroundImage}) center/cover no-repeat` : "linear-gradient(135deg, #FFF2DF 0%, #FEECD0 100%)";
        return (
          <div style={{ position: "relative", padding: pad, background: bg, textAlign: align as CSSProperties["textAlign"] }}>
            {showOverlay && backgroundImage && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />}
            <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: align === "center" ? "0 auto" : undefined }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: backgroundImage ? "#fff" : "#161616", marginBottom: "1rem", lineHeight: 1.2 }}>{heading}</h1>
              <p style={{ fontSize: "1.125rem", color: backgroundImage ? "rgba(255,255,255,0.85)" : "#475467", marginBottom: "2rem", lineHeight: 1.7 }}>{subtext}</p>
              <a href={ctaHref} style={{ display: "inline-block", background: "#EC8900", color: "#fff", padding: "14px 36px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}>{ctaButton}</a>
            </div>
          </div>
        );
      },
    },

    CTASection: {
      label: "CTA Section",
      fields: {
        heading: { type: "text",     label: "Heading"     },
        body:    { type: "textarea", label: "Body Text"   },
        label:   { type: "text",     label: "Button Text" },
        href:    { type: "text",     label: "Button Link" },
        variant: {
          type: "radio", label: "Style",
          options: [
            { value: "orange", label: "Orange" },
            { value: "dark",   label: "Dark"   },
            { value: "light",  label: "Light"  },
          ],
        },
      },
      defaultProps: { heading: "Ready to Make a Difference?", body: "Every donation counts. Help us reach our goal and change more lives.", label: "Donate Now", href: "/donate", variant: "orange" },
      render: ({ heading, body, label, href, variant }) => {
        const bg     = variant === "dark" ? "#1C1C1C" : variant === "light" ? "#F7F9FB" : "#EC8900";
        const text   = variant === "light" ? "#161616" : "#fff";
        const sub    = variant === "light" ? "#475467" : "rgba(255,255,255,0.85)";
        const btnBg  = variant === "light" ? "#EC8900" : "#fff";
        const btnTxt = variant === "light" ? "#fff"    : "#EC8900";
        return (
          <div style={{ padding: "64px 40px", background: bg, textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: text, marginBottom: "1rem" }}>{heading}</h2>
            <p style={{ fontSize: "1rem", color: sub, maxWidth: 560, margin: "0 auto 2rem" }}>{body}</p>
            <a href={href} style={{ display: "inline-block", background: btnBg, color: btnTxt, padding: "14px 40px", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>{label}</a>
          </div>
        );
      },
    },

    TwoColumnCards: {
      label: "Two-Column Cards",
      fields: {
        leftHeading:  { type: "text",     label: "Left Heading"    },
        leftBody:     { type: "textarea", label: "Left Body"       },
        leftImage:    { type: "text",     label: "Left Image URL"  },
        rightHeading: { type: "text",     label: "Right Heading"   },
        rightBody:    { type: "textarea", label: "Right Body"      },
        rightImage:   { type: "text",     label: "Right Image URL" },
      },
      defaultProps: { leftHeading: "Our Story", leftBody: "Founded in 2003, Charity Week has grown into one of the largest student-led charity campaigns in the UK.", leftImage: "", rightHeading: "Our Impact", rightBody: "Over £30 million raised for orphans and vulnerable children across 30+ countries.", rightImage: "" },
      render: ({ leftHeading, leftBody, leftImage, rightHeading, rightBody, rightImage }) => (
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
      ),
    },

    // ── CONTENT ─────────────────────────────────────────────────────────────────

    DonationWidget: {
      label: "Donation Widget",
      fields: {
        heading:      { type: "text", label: "Heading"       },
        goalAmount:   { type: "text", label: "Goal Amount"   },
        raisedAmount: { type: "text", label: "Amount Raised" },
        donorsCount:  { type: "text", label: "Donors Count"  },
        ctaLabel:     { type: "text", label: "Button Label"  },
        ctaHref:      { type: "text", label: "Button Link"   },
      },
      defaultProps: { heading: "Help Us Reach Our Goal", goalAmount: "100,000", raisedAmount: "67,450", donorsCount: "1,243", ctaLabel: "Donate Now", ctaHref: "/donate" },
      render: ({ heading, goalAmount, raisedAmount, donorsCount, ctaLabel, ctaHref }) => {
        const goal   = parseFloat((goalAmount   || "100000").replace(/,/g, "")) || 100000;
        const raised = parseFloat((raisedAmount || "0").replace(/,/g, ""))      || 0;
        const pct    = Math.min(100, Math.round((raised / goal) * 100));
        return (
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
        );
      },
    },

    ImpactStories: {
      label: "Impact Stories",
      fields: {
        heading:     { type: "text",     label: "Section Heading"   },
        story1Title: { type: "text",     label: "Story 1 Title"     },
        story1Body:  { type: "textarea", label: "Story 1 Body"      },
        story1Image: { type: "text",     label: "Story 1 Image URL" },
        story2Title: { type: "text",     label: "Story 2 Title"     },
        story2Body:  { type: "textarea", label: "Story 2 Body"      },
        story2Image: { type: "text",     label: "Story 2 Image URL" },
        story3Title: { type: "text",     label: "Story 3 Title"     },
        story3Body:  { type: "textarea", label: "Story 3 Body"      },
        story3Image: { type: "text",     label: "Story 3 Image URL" },
      },
      defaultProps: { heading: "Stories of Impact", story1Title: "A New Beginning", story1Body: "Thanks to your generosity, Ahmed now attends school and dreams of becoming a doctor.", story1Image: "", story2Title: "Safe & Warm", story2Body: "The Al-Rashidi family received emergency housing support during the winter months.", story2Image: "", story3Title: "Learning to Hope", story3Body: "Fatima's scholarship has transformed her family's future for generations to come.", story3Image: "" },
      render: ({ heading, story1Title, story1Body, story1Image, story2Title, story2Body, story2Image, story3Title, story3Body, story3Image }) => {
        const stories = [{ title: story1Title, body: story1Body, image: story1Image }, { title: story2Title, body: story2Body, image: story2Image }, { title: story3Title, body: story3Body, image: story3Image }];
        return (
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
        );
      },
    },

    FAQSection: {
      label: "FAQ Section",
      fields: {
        heading: { type: "text",     label: "Section Heading" },
        q1: { type: "text",     label: "Question 1" }, a1: { type: "textarea", label: "Answer 1" },
        q2: { type: "text",     label: "Question 2" }, a2: { type: "textarea", label: "Answer 2" },
        q3: { type: "text",     label: "Question 3" }, a3: { type: "textarea", label: "Answer 3" },
        q4: { type: "text",     label: "Question 4" }, a4: { type: "textarea", label: "Answer 4" },
      },
      defaultProps: { heading: "Frequently Asked Questions", q1: "How is my donation used?", a1: "100% of your donation goes directly to supporting orphans and vulnerable children through our vetted partners.", q2: "Is my donation tax-deductible?", a2: "Yes, IRUK is a registered charity and all donations are eligible for Gift Aid in the UK.", q3: "Can I fundraise on behalf of an institution?", a3: "Absolutely. Register your institution through our campaign portal and start raising funds today.", q4: "How do I track the impact of my donation?", a4: "We send regular impact reports to all donors, including stories and metrics from the ground." },
      render: ({ heading, q1, a1, q2, a2, q3, a3, q4, a4 }) => {
        const items = [{ q: q1, a: a1 }, { q: q2, a: a2 }, { q: q3, a: a3 }, { q: q4, a: a4 }].filter(({ q }) => q);
        return (
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
        );
      },
    },

    RichTextBlock: {
      label: "Rich Text Block",
      fields: {
        heading: { type: "text",     label: "Heading (optional)" },
        body:    { type: "textarea", label: "Body Text"          },
        align: {
          type: "radio", label: "Alignment",
          options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }],
        },
      },
      defaultProps: { heading: "Our Commitment", body: "We are committed to transparency, accountability, and delivering maximum impact with every donation received.", align: "left" },
      render: ({ heading, body, align }) => (
        <div style={{ padding: "48px 40px", textAlign: align as CSSProperties["textAlign"] }}>
          {heading && <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#161616", marginBottom: "1rem" }}>{heading}</h2>}
          <p style={{ fontSize: "1rem", color: "#475467", lineHeight: 1.8, maxWidth: "720px", margin: align === "center" ? "0 auto" : undefined }}>{body}</p>
        </div>
      ),
    },

    // ── MEDIA ────────────────────────────────────────────────────────────────────

    ImageGallery: {
      label: "Image Gallery",
      fields: {
        caption: { type: "text", label: "Caption (optional)" },
        img1: { type: "text", label: "Image 1 URL" },
        img2: { type: "text", label: "Image 2 URL" },
        img3: { type: "text", label: "Image 3 URL" },
      },
      defaultProps: { caption: "", img1: "", img2: "", img3: "" },
      render: ({ caption, img1, img2, img3 }) => (
        <div style={{ padding: "0 40px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[img1, img2, img3].map((src, i) =>
              src ? <img key={i} src={src} alt="" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
                  : <div key={i} style={{ height: "180px", background: "#F7F9FB", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #E5E7EB", color: "#A1A1A1", fontSize: "0.75rem" }}>Image {i + 1}</div>
            )}
          </div>
          {caption && <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#A1A1A1", marginTop: "10px" }}>{caption}</p>}
        </div>
      ),
    },

    VideoEmbed: {
      label: "Video Embed",
      fields: {
        videoUrl:    { type: "text",  label: "YouTube / Vimeo URL" },
        caption:     { type: "text",  label: "Caption (optional)"  },
        aspectRatio: {
          type: "radio", label: "Aspect Ratio",
          options: [{ value: "16/9", label: "16:9" }, { value: "4/3", label: "4:3" }],
        },
      },
      defaultProps: { videoUrl: "", caption: "", aspectRatio: "16/9" },
      render: ({ videoUrl, caption, aspectRatio }) => {
        const embedUrl = videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/");
        return (
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
        );
      },
    },
  },
};
