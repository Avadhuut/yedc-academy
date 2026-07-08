package com.yedc.academy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdminAnalyticsResponse {
    private BigDecimal totalRevenue;
    private long totalStudents;
    private long totalCourses;
    private long totalEnrollments;
    private List<RecentEnrollment> recentEnrollments;
    private List<CourseRevenue> courseRevenues;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentEnrollment {
        private Long id;
        private String studentName;
        private String studentEmail;
        private String courseTitle;
        private LocalDateTime purchasedAt;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CourseRevenue {
        private Long courseId;
        private String courseTitle;
        private BigDecimal revenue;
        private long enrollmentCount;
    }
}
