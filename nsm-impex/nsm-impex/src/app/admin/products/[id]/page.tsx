import { ProductForm } from '@/components/admin/ProductForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Edit Product</h1>
      <ProductForm productId={id} />
    </div>
  )
}
