package com.yedc.academy.dto;

import lombok.Data;

@Data
public class ProgressRequest {
    private Integer watchPercentage;
    private Boolean completed;
}
