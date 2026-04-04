# NSS Portal — Paid Extensions Specification

> This document contains all details needed for a coding agent to design and develop the paid extension features for the NSS Portal activity system.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Extension 1: AI Report Generator](#extension-1-ai-report-generator)
3. [Extension 2: Activity Templates](#extension-2-activity-templates)
4. [Extension 3: Pro PDF Reports](#extension-3-pro-pdf-reports)
5. [Extension 4: Smart Image Gallery (AI)](#extension-4-smart-image-gallery-ai)
6. [Extension 5: Unit Analytics Dashboard](#extension-5-unit-analytics-dashboard)
7. [Extension 6: AI Activity Consolidator (Admin)](#extension-6-ai-activity-consolidator-admin)
8. [Extension 7: Clone Activity](#extension-7-clone-activity)
9. [Extension 8: AI Auto-Fill from Images](#extension-8-ai-auto-fill-from-images)
10. [Database Schema (Already Prepared)](#database-schema-already-prepared)
11. [Licensing & Gating Architecture](#licensing--gating-architecture)
12. [Tech Stack Context](#tech-stack-context)

---

## Architecture Overview

### Current Free Tier (Already Implemented)

The free tier provides a complete activity management system:

- **Unit Dashboard** (`/dashboard/unit/activities`): Lists all activities for the unit with status badges
- **Create Activity** (`/dashboard/unit/activities/create`): Full form with:
  - Activity title, type (predefined + "Other"), description, location
  - Start/end dates, duration (hours), students attended
  - Rich text report (TipTap editor, stored as HTML)
  - Up to 10 image uploads (Supabase Storage bucket: `activity-images`)
  - Organizer name, max participants
- **Admin Dashboard** (`/dashboard/admin/activities`): Filterable list with:
  - Filters: search, district, activity type, approval status
  - Detail modal with full activity info, report, images
  - Status workflow: pending → approved / rejected / changes_requested
  - Single-activity PDF download (jsPDF, includes all details + embedded images)

### Extension Architecture Pattern

Each paid extension should follow this pattern:

```
src/extensions/{extension-name}/
  ├── components/       # UI components
  ├── hooks/            # Custom hooks
  ├── services/         # API/AI service calls
  └── index.ts          # Extension registration
```

Extensions are gated by a licensing check. The free tier code already has **hook columns** in the database for extension data (see Database Schema section below).

---

## Extension 1: AI Report Generator

### Purpose
Units spend significant time writing activity reports manually. This extension generates a well-structured report from bullet points or keywords using an LLM.

### User Flow
1. In the Create Activity form, user sees a "Generate with AI" button next to the report editor
2. A modal opens asking for:
   - Key points / bullet points about the activity (textarea)
   - Tone: Formal / Semi-formal (radio)
3. User clicks "Generate"
4. AI returns a structured HTML report (matching TipTap format)
5. Report is inserted into the rich text editor
6. User can edit the generated report before submitting

### Technical Requirements

**AI Provider:** OpenAI GPT-4o-mini or Anthropic Claude Haiku (cost-optimized)

**Prompt Template:**
```
You are writing an official NSS (National Service Scheme) activity report.

Activity Details:
- Title: {title}
- Type: {activity_type}
- Date: {start_date} to {end_date}
- Location: {location}
- Students Attended: {students_attended}
- Duration: {duration_hours} hours

Key Points from the organizer:
{user_bullet_points}

Write a structured activity report in HTML format with:
- An introduction paragraph
- Main body describing what happened
- Outcomes and impact
- Conclusion

Use <h2>, <p>, <ul>, <li>, <strong> tags. Keep it professional and factual.
Tone: {tone}
Word count: 300-500 words.
```

**Backend:** Supabase Edge Function `generate-activity-report`
- Input: `{ title, activity_type, start_date, end_date, location, students_attended, duration_hours, bullet_points, tone }`
- Output: `{ report_html: string }`
- Set `ai_generated = true` on the activity record after insertion

**Frontend Components:**
- `AIReportModal.tsx` — modal with bullet points input, tone selector, generate button
- `AIReportButton.tsx` — button placed next to the RichTextEditor toolbar
- Loading state with streaming text effect (optional)

**Database Hook (already exists):**
- `activities.ai_generated` (boolean) — set to `true` when AI generates the report
- `activities.report` (text) — stores the HTML output

**Cost Estimation:** ~$0.002 per report generation (GPT-4o-mini)

---

## Extension 2: Activity Templates

### Purpose
Units run the same types of activities repeatedly (monthly blood camps, weekly cleanups). Templates eliminate re-entering the same details every time.

### User Flow
1. After creating an activity, user sees "Save as Template" button
2. Saves current form state as a named template
3. On the Create Activity page, a "Use Template" dropdown appears at the top
4. Selecting a template pre-fills all form fields (title, type, description, location, duration, etc.)
5. User can modify pre-filled values before submitting

### Technical Requirements

**Database:**
```sql
CREATE TABLE public.activity_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES nss_units(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  template_data jsonb NOT NULL,  -- stores all form field values
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_templates_unit ON public.activity_templates(unit_id);
```

**Template Data Schema (JSON):**
```json
{
  "title": "Monthly Blood Donation Camp",
  "description": "Regular blood donation camp organized by...",
  "activity_type": "blood_donation",
  "location": "College Auditorium",
  "duration_hours": 4,
  "organizer": "NSS Unit 123",
  "report_template": "<p>The monthly blood donation camp was held at...</p>"
}
```

**Frontend Components:**
- `TemplateSelector.tsx` — dropdown at top of Create Activity form
- `SaveTemplateModal.tsx` — modal to name and save current form as template
- `ManageTemplatesPage.tsx` — list/delete templates (accessible from unit profile or settings)

**Database Hook (already exists):**
- `activities.template_id` (uuid, nullable) — links to the template used to create this activity

**Service Methods:**
- `getTemplates(unitId)` — fetch all templates for a unit
- `createTemplate(unitId, name, templateData)` — save new template
- `deleteTemplate(templateId)` — remove template
- `incrementUsage(templateId)` — track usage count

---

## Extension 3: Pro PDF Reports

### Purpose
Free tier generates a basic plain PDF. Pro PDFs include branding, custom layouts, and bulk export.

### Features

**Single Activity Pro PDF:**
- Unit logo in header (fetched from unit profile or uploaded)
- College name and NSS unit number in header
- Formatted table of details (not plain text)
- Styled section headers with accent colors
- Page numbers with unit branding in footer
- QR code linking back to the activity in the portal

**Bulk PDF Export:**
- Admin or unit selects multiple activities (checkbox in list view)
- Generates a single PDF with:
  - Cover page (date range, unit info, total activities)
  - Table of contents
  - Each activity as a section
  - Summary statistics page at the end

### Technical Requirements

**Library:** Use `@react-pdf/renderer` for better styling control (replace jsPDF for pro tier)

**Frontend Components:**
- `ProPDFGenerator.tsx` — generates styled single-activity PDF
- `BulkPDFGenerator.tsx` — multi-activity consolidated PDF
- `PDFSettingsModal.tsx` — logo upload, color theme selection
- `BulkSelectToolbar.tsx` — floating toolbar when activities are selected

**Database:**
```sql
-- Store unit branding preferences
ALTER TABLE public.nss_units
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS pdf_accent_color text DEFAULT '#007850';
```

**QR Code:** Use `qrcode` npm package to generate QR codes pointing to `{APP_URL}/dashboard/admin/activities/{activityId}`

---

## Extension 4: Smart Image Gallery (AI)

### Purpose
Managing 10 images per activity across dozens of activities becomes chaotic. AI auto-captions and categorizes images.

### Features
- Auto-caption each uploaded image (AI vision model)
- Auto-categorize: group photo, activity photo, certificate, banner, etc.
- Drag-and-drop reordering of images
- Image compression/optimization before upload
- Gallery view with captions displayed

### Technical Requirements

**AI Provider:** OpenAI GPT-4o Vision or Claude 3.5 Sonnet (vision)

**Supabase Edge Function:** `analyze-activity-image`
- Input: Image URL or base64
- Output: `{ caption: string, category: string, tags: string[] }`

**Database Hook (already exists):**
- `activities.image_metadata` (jsonb) — stores per-image metadata:
```json
[
  {
    "url": "https://...",
    "caption": "Students participating in tree planting drive",
    "category": "activity_photo",
    "tags": ["tree_planting", "outdoor", "group"],
    "order": 0
  }
]
```

**Frontend Components:**
- `SmartGallery.tsx` — replaces basic image grid in Create Activity form
- `ImageCard.tsx` — shows thumbnail + caption + category badge
- `DragDropImageGrid.tsx` — drag-and-drop reordering (use `@dnd-kit/core`)
- Image compression: use `browser-image-compression` npm package before upload

**Cost Estimation:** ~$0.01 per image analysis (GPT-4o-mini vision)

---

## Extension 5: Unit Analytics Dashboard

### Purpose
Units need to report metrics to their colleges but currently have no charts or analytics.

### Features
- Activities per month (bar chart)
- Student participation trends (line chart)
- Activity type breakdown (pie chart)
- Approval rate over time
- Comparison with previous year
- Total hours contributed
- Export analytics as image/PDF

### Technical Requirements

**Library:** `recharts` (already common in React projects)

**Frontend:**
- `UnitAnalytics.tsx` — new page at `/dashboard/unit/analytics`
- `ActivityChart.tsx` — reusable chart component
- `AnalyticsSummaryCards.tsx` — key metrics at top
- Date range picker for filtering

**Service Methods:**
- `getActivityStats(unitId, dateRange)` — aggregate query
- `getMonthlyBreakdown(unitId, months)` — monthly activity counts
- `getParticipationTrends(unitId)` — students_attended over time

**Database Queries:** All data is derivable from the existing `activities` table using aggregate SQL:
```sql
SELECT 
  date_trunc('month', start_date) as month,
  count(*) as activity_count,
  sum(students_attended) as total_students,
  sum(duration_hours) as total_hours,
  count(*) FILTER (WHERE approval_status = 'approved') as approved_count
FROM activities
WHERE unit_id = $1 AND start_date >= $2
GROUP BY 1
ORDER BY 1;
```

---

## Extension 6: AI Activity Consolidator (Admin)

### Purpose
Admin manages hundreds of activities across all units. Reading each one individually is impractical. AI generates consolidated summary reports.

### Features
- Admin selects filters (district, date range, activity type)
- Clicks "Generate Summary"
- AI reads all matching activities and produces:
  - Executive summary (1-2 paragraphs)
  - Key statistics
  - Highlights by district/unit
  - Notable achievements
  - Areas for improvement
- Output can be downloaded as PDF or copied

### Technical Requirements

**Supabase Edge Function:** `consolidate-activities`
- Input: `{ filters: ActivityFilters, format: 'summary' | 'detailed' }`
- Process:
  1. Fetch all matching activities from DB
  2. Concatenate titles, descriptions, and report text (stripped HTML)
  3. Send to LLM with consolidation prompt
  4. Return structured summary

**Prompt Template:**
```
You are an NSS (National Service Scheme) administrator reviewing activity reports.

Below are {count} activity reports from {district/all districts} between {start_date} and {end_date}.

{activities_data}

Generate a consolidated report with:
1. Executive Summary (2-3 sentences)
2. Key Statistics (total activities, total students, total hours, most active units)
3. Highlights by Category (blood donation, tree planting, camps, etc.)
4. Notable Achievements
5. Recommendations

Format as clean HTML with <h2>, <p>, <ul>, <table> tags.
Keep it concise and factual.
```

**Frontend Components:**
- `ConsolidatorPanel.tsx` — filter selection + generate button
- `ConsolidatedReport.tsx` — rendered output with copy/download actions
- Streaming response for real-time generation feedback

**Cost Estimation:** ~$0.05 per consolidation (depends on number of activities, uses GPT-4o)

---

## Extension 7: Clone Activity

### Purpose
Quick way to create a new activity based on a previous one. Simpler than templates — no setup needed.

### User Flow
1. In the activity list, each activity card gets a "Clone" button
2. Clicking it navigates to Create Activity with all fields pre-filled from the source
3. Images are NOT cloned (user must upload new ones)
4. Title gets " (Copy)" suffix
5. Dates are cleared (must be set fresh)

### Technical Requirements

This is the simplest extension — purely frontend logic.

**Frontend Changes:**
- Add "Clone" icon button to each activity card in `UnitActivity.tsx`
- On click, navigate to `/dashboard/unit/activities/create?clone={activityId}`
- In `CreateActivity.tsx`, detect `clone` query param, fetch the source activity, and pre-fill all form fields

**No database changes needed.**

---

## Extension 8: AI Auto-Fill from Images

### Purpose
Premium AI feature — upload event photos and AI extracts: approximate attendance count, activity type detection, location hints. Pre-fills form fields automatically.

### User Flow
1. In Create Activity, user uploads images first
2. A "Smart Analyze" button appears
3. AI analyzes all images and suggests:
   - Estimated attendance count
   - Detected activity type
   - Location hints (from EXIF or visual cues)
   - Suggested title
4. User reviews suggestions and accepts/modifies

### Technical Requirements

**Supabase Edge Function:** `analyze-activity-images`
- Input: Array of image URLs
- Process: Send to vision model with analysis prompt
- Output:
```json
{
  "estimated_attendance": 45,
  "detected_type": "blood_donation",
  "suggested_title": "Blood Donation Camp",
  "location_hint": "Indoor auditorium setting",
  "confidence": 0.85
}
```

**Frontend Components:**
- `SmartAnalyzeButton.tsx` — appears after images are uploaded
- `SuggestionsPanel.tsx` — shows AI suggestions with accept/reject per field
- Loading state while analysis runs

**Cost Estimation:** ~$0.03 per analysis (multiple images, GPT-4o vision)

---

## Database Schema (Already Prepared)

The following columns already exist in the `activities` table as hooks for extensions:

| Column | Type | Purpose | Used By |
|--------|------|---------|---------|
| `template_id` | uuid (nullable) | Links to saved template | Extension 2 |
| `ai_generated` | boolean (default false) | Tracks AI-written reports | Extension 1 |
| `image_metadata` | jsonb (nullable) | Per-image captions/tags/order | Extension 4 |

Additional tables needed (create when implementing):

- `activity_templates` — Extension 2
- `unit_branding` or columns on `nss_units` — Extension 3
- `extension_licenses` — Licensing system

---

## Licensing & Gating Architecture

### Recommended Approach

```sql
CREATE TABLE public.extension_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES nss_units(id) ON DELETE CASCADE NOT NULL,
  extension_key text NOT NULL,  -- e.g., 'ai_report', 'templates', 'pro_pdf'
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(unit_id, extension_key)
);
```

### Extension Keys
| Key | Extension |
|-----|-----------|
| `ai_report` | AI Report Generator |
| `templates` | Activity Templates |
| `pro_pdf` | Pro PDF Reports |
| `smart_gallery` | Smart Image Gallery |
| `analytics` | Unit Analytics Dashboard |
| `ai_consolidator` | AI Activity Consolidator |
| `clone` | Clone Activity |
| `ai_autofill` | AI Auto-Fill from Images |

### Frontend Gating Hook
```typescript
// src/hooks/useExtension.ts
export const useExtension = (extensionKey: string) => {
  const { session } = UseAuthContext();
  const [isLicensed, setIsLicensed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from('extension_licenses')
        .select('is_active, expires_at')
        .eq('unit_id', unitId)
        .eq('extension_key', extensionKey)
        .single();

      setIsLicensed(
        !!data?.is_active &&
        (!data.expires_at || new Date(data.expires_at) > new Date())
      );
      setIsLoading(false);
    };
    check();
  }, [extensionKey]);

  return { isLicensed, isLoading };
};
```

### UI Pattern for Locked Features
```tsx
// Shows a "Pro" badge and upgrade prompt for locked features
const ExtensionGate = ({ extensionKey, children, fallback }) => {
  const { isLicensed, isLoading } = useExtension(extensionKey);
  
  if (isLoading) return <Skeleton />;
  if (!isLicensed) return fallback || <UpgradePrompt extension={extensionKey} />;
  return children;
};
```

---

## Tech Stack Context

For the coding agent implementing these extensions:

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| UI Components | Custom components in `src/components/ui/`, shadcn/ui in `src/components/shadcn/` |
| State Management | React hooks, no global state library |
| Rich Text Editor | TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`) |
| PDF Generation | `jsPDF` (free tier), `@react-pdf/renderer` (pro tier) |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| File Storage | Supabase Storage, bucket: `activity-images` (public) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod validation |
| Auth | Supabase Auth with role-based access (`student`, `unit`, `admin`) |
| Styling | Tailwind CSS with custom theme (`nss-*`, `blood-*`, `tree-*` color tokens) |

### Key Files Reference
| File | Purpose |
|------|---------|
| `src/services/activitiesService.ts` | Activity CRUD, filtering, image upload, status management |
| `src/views/dashboard/unit/CreateActivity.tsx` | Activity creation form |
| `src/views/dashboard/unit/UnitActivity.tsx` | Unit activity list |
| `src/views/dashboard/admin/AdminActivities.tsx` | Admin activity review, PDF generation |
| `src/components/ui/RichTextEditor.tsx` | TipTap rich text editor component |
| `src/hooks/useUnitActivities.ts` | Unit activities data hook |
| `src/routes/routeConfig.tsx` | All route definitions |
| `src/components/common/DashboardNavigation.tsx` | Dashboard sidebar navigation |

### Supabase Configuration
- Project uses Supabase MCP for migrations
- RLS is enabled on all tables
- Views use `security_invoker = true`
- Functions use `SET search_path = ''`
- Storage policies require `authenticated` role for uploads

---

## Implementation Priority

Recommended order based on revenue potential and development effort:

| Priority | Extension | Effort | Revenue Potential |
|----------|-----------|--------|-------------------|
| 1 | Clone Activity | Low (frontend only) | Low (entry-level paid feature) |
| 2 | Activity Templates | Medium | Medium |
| 3 | AI Report Generator | Medium | High |
| 4 | Pro PDF Reports | Medium | Medium |
| 5 | Unit Analytics | Medium | Medium |
| 6 | Smart Image Gallery | High | Medium |
| 7 | AI Activity Consolidator | High | High (admin-targeted) |
| 8 | AI Auto-Fill from Images | High | High (wow factor) |

### Suggested Pricing Tiers
- **Free**: Core activity management (current implementation)
- **Basic** (~$5/month): Clone + Templates
- **Pro** (~$15/month): Basic + Pro PDF + Analytics
- **AI** (~$25/month): Pro + AI Report + Smart Gallery + AI Consolidator + AI Auto-Fill
