import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from '../FormInput';

describe('FormInput Component', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with required props', () => {
    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Input')).toHaveValue('');
  });

  it('shows required indicator when required prop is true', () => {
    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value=""
        onChange={mockOnChange}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays help text when provided', () => {
    const helpText = 'This is a helpful message';
    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value=""
        onChange={mockOnChange}
        helpText={helpText}
      />
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', () => {
    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Test Input');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur handler when input loses focus', () => {
    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Test Input');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('validates required field on blur', () => {
    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value=""
        onChange={mockOnChange}
        required
      />
    );

    const input = screen.getByLabelText('Test Input');
    fireEvent.blur(input);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows custom validation error when validation fails', () => {
    const validationRules = [
      {
        test: (value: string) => value.length >= 5,
        message: 'Input must be at least 5 characters long'
      }
    ];

    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value="abc"
        onChange={mockOnChange}
        validationRules={validationRules}
      />
    );

    const input = screen.getByLabelText('Test Input');
    fireEvent.blur(input);

    expect(screen.getByText('Input must be at least 5 characters long')).toBeInTheDocument();
  });

  it('applies disabled style when disabled prop is true', () => {
    render(
      <FormInput
        id="test-input"
        name="test-input"
        label="Test Input"
        value=""
        onChange={mockOnChange}
        disabled
      />
    );

    const input = screen.getByLabelText('Test Input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100');
  });
});
