import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { supabase } from '~/lib/supabase';

interface InvoiceItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    name: string;
  };
}

interface Invoice {
  id: string;
  invoice_number: string;
  total_amount: number;
  created_at: string;
  shop_name: string;
  status: string;
  description: string;
  items: InvoiceItem[];
}

export default function InvoiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchInvoiceDetails();
    }
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (invoiceError) throw invoiceError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select(`
          *,
          product:products(name)
        `)
        .eq('invoice_id', id);

      if (itemsError) throw itemsError;

      setInvoice({
        ...invoiceData,
        items: itemsData || [],
      });
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading invoice details...</Text>
      </View>
    );
  }

  if (!invoice) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Invoice not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Invoice Details</Text>
        <Button variant="ghost" onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
      </View>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Invoice #{invoice.invoice_number}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="font-medium">Shop Name</Text>
              <Text>{invoice.shop_name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-medium">Date</Text>
              <Text>{formatDate(invoice.created_at)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-medium">Status</Text>
              <Text className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">
                {invoice.status}
              </Text>
            </View>
            <View className="space-y-1">
              <Text className="font-medium">Description</Text>
              <Text className="text-muted-foreground">{invoice.description}</Text>
            </View>
          </View>

          <View className="space-y-2">
            <Text className="font-medium">Items</Text>
            {invoice.items.map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center p-3 border-b border-border"
              >
                <View>
                  <Text className="font-medium">{item.product.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {item.quantity} x ${item.unit_price.toFixed(2)}
                  </Text>
                </View>
                <Text className="font-semibold">
                  ${item.total_price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View className="pt-4 border-t border-input">
            <Text className="text-lg font-bold text-right">
              Total: ${invoice.total_amount.toFixed(2)}
            </Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
