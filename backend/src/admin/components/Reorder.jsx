import React, { useState } from 'react';
import { ApiClient, useNotice } from 'adminjs';
import { Box, Button, Card, H2, Icon, Text } from '@adminjs/design-system';

const Reorder = (props) => {
  const itemsFromServer = props?.actionResponse?.data?.records || [];
  const [items, setItems] = useState(itemsFromServer);
  const [dragIndex, setDragIndex] = useState(null);
  const addNotice = useNotice();
  const api = new ApiClient();
  const { resource } = props;

  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setDragIndex(index);
    setItems(updated);
  };
  const onDragEnd = () => setDragIndex(null);

  const save = async () => {
    const order = items.map((item, index) => ({ id: item.id, order: index + 1 }));
    await api.resourceAction({
      resourceId: resource.id,
      actionName: 'reorder',
      data: { order },
      method: 'post',
    });
    addNotice({ message: 'ترتیب ذخیره شد', type: 'success' });
  };

  return (
    <Box variant="white" p="xl" style={{ direction: 'rtl' }}>
      <H2 mb="lg">چینش آیتم‌ها</H2>
      <Card variant="container" p="lg">
        {items.length === 0 ? (
          <Text color="grey60">موردی برای مرتب‌سازی وجود ندارد.</Text>
        ) : (
          <Box as="ul" p={0} m={0} style={{ listStyle: 'none' }}>
            {items.map((item, index) => (
              <Box
                as="li"
                key={item.id}
                p="md"
                mb="sm"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bg="grey10"
                borderRadius="lg"
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver(index);
                }}
                onDragEnd={onDragEnd}
              >
                <Box display="flex" alignItems="center" gap="md">
                  <Icon icon="Grip" />
                  <Text>{item.title}</Text>
                </Box>
                <Text color="grey60">اولویت فعلی: {index + 1}</Text>
              </Box>
            ))}
          </Box>
        )}
        <Button mt="lg" variant="primary" onClick={save} disabled={items.length === 0}>
          ذخیره ترتیب
        </Button>
      </Card>
    </Box>
  );
};

export default Reorder;
