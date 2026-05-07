import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature') as string
  
  console.log('Webhook secret first 10 chars:', process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10))
  console.log('Signature:', signature?.substring(0, 50))

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { assessmentId } = session.metadata || {}

    console.log('Checkout session completed:', session.id)
    console.log('Assessment ID from metadata:', assessmentId)

    if (assessmentId) {
      const supabase = await createClient()

      const { error } = await supabase
        .from('assessments')
        .update({ fee_paid: true })
        .eq('id', assessmentId)

      if (error) {
        console.error('Failed to update assessment:', error)
        return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 })
      }

      console.log(`✅ Assessment ${assessmentId} marked as paid`)
    } else {
      console.log('No assessmentId in session metadata')
    }
  }

  return NextResponse.json({ received: true })
}