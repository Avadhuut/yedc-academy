CREATE TABLE instructor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    experience VARCHAR(255),
    profile_image VARCHAR(255)
);

CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE course (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES category(id),
    instructor_id BIGINT NOT NULL REFERENCES instructor(id),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0.00),
    thumbnail VARCHAR(255),
    language VARCHAR(50) DEFAULT 'English',
    level VARCHAR(50) DEFAULT 'BEGINNER',
    duration VARCHAR(100),
    status VARCHAR(20) DEFAULT 'INACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE section (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES course(id),
    title VARCHAR(255) NOT NULL,
    display_order INT NOT NULL,
    CONSTRAINT uq_section_order UNIQUE (course_id, display_order)
);

CREATE TABLE lesson (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL REFERENCES section(id),
    title VARCHAR(255) NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    pdf_url VARCHAR(255),
    duration INT DEFAULT 0,
    preview_enabled BOOLEAN DEFAULT FALSE,
    display_order INT NOT NULL,
    CONSTRAINT uq_lesson_order UNIQUE (section_id, display_order)
);

-- Seed Categories
INSERT INTO category (name, description) VALUES 
('Startup & Strategy', 'Build, validate, and scale your business from the ground up.'),
('Digital Marketing', 'Acquire customers and grow your brand using modern online marketing strategies.'),
('Business Finance', 'Master accounting, fund-raising, budgeting, and financial planning.');

-- Seed Instructors
INSERT INTO instructor (name, bio, experience, profile_image) VALUES
('Dr. Anirudh Sharma', 'Harvard MBA graduate. Former venture capitalist with 15+ years of experience investing in early-stage startups across India and Southeast Asia.', '15+ Years in VC & Venture Builder', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256'),
('Ms. Priya Nair', 'Growth marketing pioneer. Former VP of Marketing at a prominent tech unicorn. Helped scale user acquisition from 10k to 10M monthly active users.', '10+ Years in Growth Marketing', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256');

-- Seed Courses (Active: 3, Inactive: 1)
INSERT INTO course (category_id, instructor_id, title, subtitle, description, price, thumbnail, language, level, duration, status) VALUES
(1, 1, 'Startup Foundations: Zero to One', 'Master the frameworks to launch your business and raise initial capital', 'This comprehensive course walks you through validating a business idea, constructing a business model, building an MVP, acquiring first customers, and preparing pitch presentations for angels and VCs. Dr. Anirudh Sharma shares practical insights from reviewing thousands of pitch decks.', 1999.00, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=640', 'English', 'BEGINNER', '8 Hours', 'ACTIVE'),
(2, 2, 'Digital Marketing Mastery', 'Build a modern digital marketing funnel and scale user acquisition', 'Learn how to construct a repeatable, profitable user acquisition funnel. This course covers SEO strategies, paid acquisition channels (Google, Meta), growth hacking loops, conversion rate optimization (CRO), and email marketing automation.', 1499.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=640', 'English', 'INTERMEDIATE', '12 Hours', 'ACTIVE'),
(3, 1, 'Financial Modelling for Entrepreneurs', 'Construct realistic financial projections and master unit economics', 'Master the numerical side of running a business. Learn how to design a 3-statement financial model, estimate customer lifetime value (LTV), compute customer acquisition cost (CAC), forecast cash flow burn, and determine pre-money valuation.', 2499.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=640', 'English', 'ADVANCED', '10 Hours', 'ACTIVE'),
(2, 2, 'Growth Hacking Bootcamp', 'Advanced growth heuristics and viral loop implementation strategies', 'An intensive bootcamp exploring viral engines, product-led growth (PLG) mechanics, programmatic SEO systems, and building high-performance marketing experiments.', 999.00, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=640', 'English', 'INTERMEDIATE', '6 Hours', 'INACTIVE');

-- Seed Sections for Course 1 (Startup Foundations)
INSERT INTO section (course_id, title, display_order) VALUES
(1, 'Ideation and Customer Discovery', 1),
(1, 'Building and Launching your MVP', 2),
(1, 'Pitching and Fundraising Mechanics', 3);

-- Seed Lessons for Course 1, Section 1 (Ideation)
INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order) VALUES
(1, 'Introduction to the Lean Canvas', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 600, TRUE, 1),
(1, 'Conducting Effective Customer Interviews', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', NULL, 900, FALSE, 2);

-- Seed Lessons for Course 1, Section 2 (MVP)
INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order) VALUES
(2, 'Defining Your Core Value Proposition', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 720, TRUE, 1),
(2, 'No-Code Tools for Rapid Prototyping', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', NULL, 1200, FALSE, 2);

-- Seed Lessons for Course 1, Section 3 (Fundraising)
INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order) VALUES
(3, 'Structuring the Startup Pitch Deck', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 1050, FALSE, 1);

-- Seed Sections for Course 2 (Digital Marketing Mastery)
INSERT INTO section (course_id, title, display_order) VALUES
(2, 'Funnel Architecture & Analytics Setup', 1),
(2, 'Paid Traffic: Facebook and Google Ads', 2);

-- Seed Lessons for Course 2, Section 1 (Funnel Setup)
INSERT INTO lesson (section_id, title, video_url, pdf_url, duration, preview_enabled, display_order) VALUES
(4, 'Mapping the Customer Acquisition Funnel', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 800, TRUE, 1),
(4, 'Google Analytics & Tag Manager Setup', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', NULL, 1100, FALSE, 2);
