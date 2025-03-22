import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import * as React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { supabase } from '~/lib/supabase';
import { useAuth } from '~/lib/useAuth';
import { formatCurrency } from '~/lib/utils/currency';

interface Invoice {
  id: string;
  invoice_number: string;
  total_amount: number;
  created_at: string;
  shop_name: string;
  status: string;
}

export default function InvoiceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchInvoices();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        return;
      }
      setInvoices(data || []);
    } catch (error) {
      console.error('Unexpected error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <ScrollView
      className="flex-1 p-4 bg-secondary/30"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="mb-4">
        <Text className="text-2xl font-bold">Invoices</Text>
        <Text className="text-muted-foreground">Manage your billing and payments</Text>
      </View>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Text className="text-center text-muted-foreground">Loading invoices...</Text>
          ) : invoices.length === 0 ? (
            <Text className="text-center text-muted-foreground">No invoices found</Text>
          ) : (
            <View className="space-y-2">
              {invoices.map((invoice) => (
                <TouchableOpacity
                  key={invoice.id}
                  onPress={() => router.push(`/invoice/${invoice.id}`)}
                  className="flex-row justify-between items-center p-3 border-b border-border"
                >
                  <View>
                    <Text className="font-medium">Invoice #{invoice.invoice_number}</Text>
                    <Text className="text-sm text-muted-foreground">{invoice.shop_name}</Text>
                    <Text className="text-xs text-muted-foreground">{formatDate(invoice.created_at)}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-semibold">{formatCurrency(invoice.total_amount)}</Text>
                    <Text className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">{invoice.status}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </CardContent>
        {invoices.length > 0 && (
          <CardFooter>
            <Text className="text-sm text-muted-foreground">Showing {invoices.length} invoices</Text>
          </CardFooter>
        )}
      </Card>

      <TouchableOpacity
        onPress={() => router.push('/invoice/create')}
        className="absolute right-4 bottom-4 justify-center items-center w-14 h-14 rounded-full shadow-lg bg-primary"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}
