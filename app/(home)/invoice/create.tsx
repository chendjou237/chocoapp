import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Toast } from 'toastify-react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import type { Product } from '~/lib/supabase';
import { supabase } from '~/lib/supabase';
import { useAuth } from '~/lib/useAuth';
import { formatCurrency } from '~/lib/utils/currency';

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [shopName, setShopName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Array<{ product: Product; quantity: number }>>([]);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    setProducts(data || []);
  };

  const addProduct = () => {
    if (products.length > 0) {
      setSelectedItems([...selectedItems, { product: products[0], quantity: 1 }]);
    }
  };

  const updateQuantity = (index: number, quantity: string) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = parseInt(quantity) || 0;
    setSelectedItems(newItems);
  };

  const updateProduct = (index: number, productId: string) => {
    const product = products.find(p => p.id == productId);
    if (product) {
      //  console.error('hey there');

      const newItems = [...selectedItems];
      newItems[index].product = product;
      setSelectedItems(newItems);
    }
  };

  const removeProduct = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const total = calculateTotal();

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        total_amount:total,
        description,
        invoice_number: Math.floor(Math.random() * 1000000000),
        shop_name: shopName,
        status: 'delivered',
      })
      .select()
      .single();

    if (invoiceError || !invoice) {
      console.error('Error creating invoice:', invoiceError);
      return;
    }

    const invoiceItems = selectedItems.map(item => ({
      invoice_id: invoice.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) {
      console.error('Error creating invoice items:', itemsError);
      return;
    }
    Toast.success('invoice created successfully', 'bottom');
    router.push({
      pathname: '/invoice',
      params: { refresh: 'true' }
    });
};


   //  router.back();


  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Create Invoice</Text>
        <Button variant="ghost" onPress={() => router.back()}>
          <Text>Cancel</Text>
        </Button>
      </View>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <View className="space-y-2">
            <Text className="text-sm font-medium">Shop Name</Text>
            <TextInput
              className="px-3 py-2 h-10 text-sm rounded-md border border-input bg-background"
              placeholder="Enter shop name"
              value={shopName}
              onChangeText={setShopName}
            />
          </View>
          <View className="space-y-2">
            <Text className="text-sm font-medium">Description</Text>
            <TextInput
              className="px-3 py-2 h-10 text-sm rounded-md border border-input bg-background"
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {selectedItems.map((item, index) => (
            <View key={index} className="pb-4 space-y-2 border-b border-input">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-medium">Product {index + 1}</Text>
                <Button variant="ghost" onPress={() => removeProduct(index)}>
                  <Text className="text-destructive">Remove</Text>
                </Button>
              </View>

              <View className="overflow-hidden rounded-md border">
                <Picker
                selectedValue={item.product.id}
                  onValueChange={(value) => updateProduct(index, value)}
                  style={{ width: '100%' }}
                >
                  {products.map((product) => (
                    <Picker.Item
                      key={product.id}
                      label={`${product.name} (${formatCurrency(product.price)})`}
                      value={product.id}

                    />
                  ))}
                </Picker>
              </View>

              <View className="space-y-2">
                <Text className="text-sm font-medium">Quantity</Text>
                <TextInput
                  className="px-3 py-2 h-10 text-sm rounded-md border border-input bg-background"
                  placeholder="Enter quantity"
                  value={item.quantity.toString()}
                  onChangeText={(value) => updateQuantity(index, value)}
                  keyboardType="number-pad"
                />
              </View>

              <Text className="text-sm text-right">
                Subtotal: {formatCurrency(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}

          <Button className="w-full" variant="outline" onPress={addProduct}>
            <Text>Add Product</Text>
          </Button>

          <View className="pt-4 border-t border-input">
            <Text className="text-lg font-bold text-right">
              Total: {formatCurrency(calculateTotal())}
            </Text>
          </View>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onPress={handleSubmit}
            disabled={selectedItems.length === 0}
          >
            <Text className="text-primary-foreground">Create Invoice</Text>
          </Button>
        </CardFooter>
      </Card>
    </ScrollView>
  );
}
