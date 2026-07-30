-- Seed Sections for Course 3 safely
INSERT INTO section (course_id, title, display_order) 
SELECT 3, 'Module 1: Unit Economics & Capital Sizing', 1
WHERE EXISTS (SELECT 1 FROM course WHERE id = 3)
ON CONFLICT DO NOTHING;

INSERT INTO section (course_id, title, display_order) 
SELECT 3, 'Module 2: Machinery Procurement & Cost Structure', 2
WHERE EXISTS (SELECT 1 FROM course WHERE id = 3)
ON CONFLICT DO NOTHING;

INSERT INTO section (course_id, title, display_order) 
SELECT 3, 'Module 3: FSSAI Licensing & B2B Distribution', 3
WHERE EXISTS (SELECT 1 FROM course WHERE id = 3)
ON CONFLICT DO NOTHING;

-- Seed Lessons for Course 3
INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order)
SELECT s.id, 'Financial Projections & Cost Calculation Model', '/videos/sample.mp4', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 900, TRUE, 1
FROM section s WHERE s.course_id = 3 AND s.display_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order)
SELECT s.id, 'Machinery Sourcing & Equipment ROI Analysis', '/videos/sample.mp4', NULL, 1200, FALSE, 2
FROM section s WHERE s.course_id = 3 AND s.display_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order)
SELECT s.id, 'Compliance, FSSAI Registration & B2B Contracts', '/videos/sample.mp4', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 1500, FALSE, 1
FROM section s WHERE s.course_id = 3 AND s.display_order = 3
ON CONFLICT DO NOTHING;

-- Seed Sections for Course 4 safely
INSERT INTO section (course_id, title, display_order) 
SELECT 4, 'Module 1: Viral Growth Engines & Experimentation', 1
WHERE EXISTS (SELECT 1 FROM course WHERE id = 4)
ON CONFLICT DO NOTHING;

INSERT INTO section (course_id, title, display_order) 
SELECT 4, 'Module 2: Programmatic SEO & PLG Systems', 2
WHERE EXISTS (SELECT 1 FROM course WHERE id = 4)
ON CONFLICT DO NOTHING;

-- Seed Lessons for Course 4
INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order)
SELECT s.id, 'Building High-Converting Viral Loops', '/videos/sample.mp4', NULL, 1000, TRUE, 1
FROM section s WHERE s.course_id = 4 AND s.display_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order)
SELECT s.id, 'Product-Led Growth Architecture', '/videos/sample.mp4', NULL, 1100, FALSE, 1
FROM section s WHERE s.course_id = 4 AND s.display_order = 2
ON CONFLICT DO NOTHING;

-- Seed Sections for Course 5 safely if present
INSERT INTO section (course_id, title, display_order) 
SELECT 5, 'Module 1: Snack Production & Packaging Mechanics', 1
WHERE EXISTS (SELECT 1 FROM course WHERE id = 5)
ON CONFLICT DO NOTHING;

INSERT INTO section (course_id, title, display_order) 
SELECT 5, 'Module 2: Distributor Margin Structuring', 2
WHERE EXISTS (SELECT 1 FROM course WHERE id = 5)
ON CONFLICT DO NOTHING;

-- Seed Lessons for Course 5 if present
INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order)
SELECT s.id, 'Nitrogen Pouch Packaging Machinery Setup', '/videos/sample.mp4', NULL, 950, TRUE, 1
FROM section s WHERE s.course_id = 5 AND s.display_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order)
SELECT s.id, 'Retail Distribution & Margin Architecture', '/videos/sample.mp4', NULL, 1250, FALSE, 1
FROM section s WHERE s.course_id = 5 AND s.display_order = 2
ON CONFLICT DO NOTHING;
