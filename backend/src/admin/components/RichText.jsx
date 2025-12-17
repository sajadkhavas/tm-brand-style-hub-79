import React, { useEffect, useState } from 'react';
import { Box, Label, Text, FormMessage } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = require('react-quill');

const Wrapper = styled(Box)`
  direction: rtl;
  text-align: right;
  .ql-editor {
    min-height: 220px;
    font-family: inherit;
  }
`;

const RichText = (props) => {
  const { property, onChange, record } = props;
  const value = record.params[property.path] || '';
  const [editorValue, setEditorValue] = useState(value);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (val) => {
    setEditorValue(val);
    onChange(property.path, val);
  };

  return (
    <Wrapper>
      <Label>{property.label}</Label>
      {ready ? (
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          dir="rtl"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
              [{ align: [] }],
            ],
          }}
        />
      ) : (
        <Text mt="md">در حال بارگذاری ویرایشگر...</Text>
      )}
      {record?.errors && record.errors[property.path]?.message && (
        <FormMessage mt="md" variant="danger">
          {record.errors[property.path].message}
        </FormMessage>
      )}
    </Wrapper>
  );
};

export default RichText;
