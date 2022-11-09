import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { ColorPalette } from "../../styles";

export interface InputProps {
  label: string;
  value: string;
  readOnly?: boolean;
  isInline?: boolean;
}

export const Input: FunctionComponent<InputProps> = ({
  label,
  value,
  readOnly,
  isInline,
}) => {
  return (
    <Container isInline={isInline}>
      <StyledLabel>{label}</StyledLabel>
      <StyledInput value={value} readOnly={readOnly} />
    </Container>
  );
};

const Container = styled.div<Pick<InputProps, "isInline">>`
  display: flex;
  flex-direction: ${({ isInline }) => (isInline ? "row" : "column")};
  align-items: ${({ isInline }) => (isInline ? "center" : "flex-start")};
  gap: 4px;
`;

const StyledLabel = styled.label`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #53607c;
`;

const StyledInput = styled.input`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 16px 10px 12px;
  background: ${ColorPalette["white"]};
  border: 1px solid ${ColorPalette["gray-100"]};
  border-radius: 8px;
  max-width: 400px;

  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: ${ColorPalette["black"]};
`;
