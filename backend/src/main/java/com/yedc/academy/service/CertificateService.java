package com.yedc.academy.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.yedc.academy.dto.CertificateResponse;
import com.yedc.academy.exception.BadRequestException;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.model.*;
import com.yedc.academy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final AccountRepository accountRepository;
    private final CourseRepository courseRepository;

    /**
     * Issue certificate if all lessons complete. Idempotent — returns existing if already issued.
     */
    @Transactional
    public CertificateResponse issueCertificate(Long accountId, Long courseId) {
        // Check existing
        if (certificateRepository.existsByAccountIdAndCourseId(accountId, courseId)) {
            Certificate existing = certificateRepository.findByAccountIdAndCourseId(accountId, courseId)
                    .orElseThrow();
            return toResponse(existing);
        }

        Enrollment enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElseThrow(() -> new BadRequestException("You must be enrolled in this course."));

        // Count all lessons in the course
        long totalLessons = lessonRepository.countBySectionCourseId(courseId);
        if (totalLessons == 0) {
            throw new BadRequestException("This course has no lessons.");
        }

        // Count completed lessons for this enrollment
        long completedLessons = progressRepository.countByEnrollmentIdAndCompleted(enrollment.getId(), true);

        if (completedLessons < totalLessons) {
            throw new BadRequestException(
                    "Complete all lessons to earn a certificate. Progress: " + completedLessons + "/" + totalLessons
            );
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found."));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        // Generate unique certificate number: YEDC-YYYYMMDD-XXXXXX
        String certNumber = "YEDC-" +
                java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
                "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Certificate cert = Certificate.builder()
                .account(account)
                .course(course)
                .enrollment(enrollment)
                .certificateNumber(certNumber)
                .build();

        cert = certificateRepository.save(cert);
        return toResponse(cert);
    }

    /**
     * Auto-issue certificate when progress is saved — call after progress update.
     * Silently skips if not yet complete or already issued.
     */
    @Transactional
    public void autoIssueCertificateIfComplete(Long accountId, Long courseId) {
        try {
            if (certificateRepository.existsByAccountIdAndCourseId(accountId, courseId)) return;

            Enrollment enrollment = enrollmentRepository
                    .findByAccountIdAndCourseId(accountId, courseId).orElse(null);
            if (enrollment == null) return;

            long totalLessons = lessonRepository.countBySectionCourseId(courseId);
            if (totalLessons == 0) return;

            long completedLessons = progressRepository.countByEnrollmentIdAndCompleted(enrollment.getId(), true);
            if (completedLessons < totalLessons) return;

            Account account = accountRepository.findById(accountId).orElse(null);
            Course course = courseRepository.findById(courseId).orElse(null);
            if (account == null || course == null) return;

            String certNumber = "YEDC-" +
                    java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
                    "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            certificateRepository.save(Certificate.builder()
                    .account(account)
                    .course(course)
                    .enrollment(enrollment)
                    .certificateNumber(certNumber)
                    .build());

        } catch (Exception ignored) {
            // Auto-issue failure must never break the progress update
        }
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getMyCertificates(Long accountId) {
        return certificateRepository.findAllByAccountIdOrderByIssuedAtDesc(accountId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CertificateResponse getByNumber(String certificateNumber) {
        Certificate cert = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found: " + certificateNumber));
        return toResponse(cert);
    }

    /**
     * Generate a branded PDF for a certificate and return the raw bytes.
     */
    public byte[] generatePdf(String certificateNumber) {
        Certificate cert = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found: " + certificateNumber));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            pdfDoc.setDefaultPageSize(PageSize.A4.rotate()); // Landscape

            try (Document doc = new Document(pdfDoc)) {
                doc.setMargins(40, 60, 40, 60);

                DeviceRgb indigo     = new DeviceRgb(79, 70, 229);
                DeviceRgb indigoLight= new DeviceRgb(99,  91, 255);
                DeviceRgb darkBg     = new DeviceRgb(9,   9,  11);
                DeviceRgb neutralMid = new DeviceRgb(163, 163, 163);
                DeviceRgb white      = new DeviceRgb(255, 255, 255);
                DeviceRgb gold       = new DeviceRgb(234, 179, 8);

                // Background fill via full-width table
                Table bg = new Table(UnitValue.createPercentArray(new float[]{1}))
                        .useAllAvailableWidth()
                        .setBackgroundColor(darkBg)
                        .setMarginBottom(0);

                // Top accent bar
                Table accentBar = new Table(UnitValue.createPercentArray(new float[]{1}))
                        .useAllAvailableWidth()
                        .setHeight(8)
                        .setBackgroundColor(indigo);
                doc.add(accentBar);

                // Academy badge
                Paragraph badge = new Paragraph("YEDC ACADEMY")
                        .setFontColor(indigoLight)
                        .setFontSize(10)
                        .setBold()
                        .setTextAlignment(TextAlignment.CENTER)
                        .setCharacterSpacing(4)
                        .setMarginTop(30)
                        .setMarginBottom(8);
                doc.add(badge);

                // Main heading
                Paragraph certOf = new Paragraph("Certificate of Completion")
                        .setFontColor(white)
                        .setFontSize(32)
                        .setBold()
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(24);
                doc.add(certOf);

                // Divider line (thin gold)
                Table divider = new Table(UnitValue.createPercentArray(new float[]{1}))
                        .useAllAvailableWidth()
                        .setHeight(2)
                        .setBackgroundColor(gold)
                        .setMarginBottom(24)
                        .setHorizontalAlignment(HorizontalAlignment.CENTER)
                        .setWidth(UnitValue.createPercentValue(30));
                doc.add(divider);

                // Presented to
                Paragraph presentedTo = new Paragraph("This certificate is proudly presented to")
                        .setFontColor(neutralMid)
                        .setFontSize(13)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(10);
                doc.add(presentedTo);

                // Student name
                Paragraph studentName = new Paragraph(cert.getAccount().getFullName())
                        .setFontColor(white)
                        .setFontSize(28)
                        .setBold()
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(20);
                doc.add(studentName);

                // Course name
                Paragraph forCompleting = new Paragraph("for successfully completing")
                        .setFontColor(neutralMid)
                        .setFontSize(13)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(8);
                doc.add(forCompleting);

                Paragraph courseTitle = new Paragraph(cert.getCourse().getTitle())
                        .setFontColor(indigoLight)
                        .setFontSize(20)
                        .setBold()
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(4);
                doc.add(courseTitle);

                Paragraph instructorLine = new Paragraph("by " + cert.getCourse().getInstructor().getName())
                        .setFontColor(neutralMid)
                        .setFontSize(11)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginBottom(30);
                doc.add(instructorLine);

                // Footer row: cert number + date
                String dateStr = cert.getIssuedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));
                Table footer = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                        .useAllAvailableWidth()
                        .setMarginTop(10);

                Cell leftCell = new Cell()
                        .add(new Paragraph("Certificate No: " + cert.getCertificateNumber())
                                .setFontColor(neutralMid).setFontSize(9))
                        .setBorder(Border.NO_BORDER)
                        .setPaddingLeft(0);

                Cell rightCell = new Cell()
                        .add(new Paragraph("Issued on: " + dateStr)
                                .setFontColor(neutralMid).setFontSize(9)
                                .setTextAlignment(TextAlignment.RIGHT))
                        .setBorder(Border.NO_BORDER)
                        .setPaddingRight(0);

                footer.addCell(leftCell);
                footer.addCell(rightCell);
                doc.add(footer);

                // Bottom accent bar
                Table bottomBar = new Table(UnitValue.createPercentArray(new float[]{1}))
                        .useAllAvailableWidth()
                        .setHeight(8)
                        .setBackgroundColor(indigo)
                        .setMarginTop(20);
                doc.add(bottomBar);
            }

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF: " + e.getMessage(), e);
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private CertificateResponse toResponse(Certificate c) {
        CertificateResponse res = new CertificateResponse();
        res.setId(c.getId());
        res.setCertificateNumber(c.getCertificateNumber());
        res.setCourseTitle(c.getCourse().getTitle());
        res.setCourseThumbnail(c.getCourse().getThumbnail());
        res.setInstructorName(c.getCourse().getInstructor().getName());
        res.setStudentName(c.getAccount().getFullName());
        res.setIssuedAt(c.getIssuedAt());
        return res;
    }
}
