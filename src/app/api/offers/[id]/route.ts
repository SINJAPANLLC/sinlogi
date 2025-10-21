import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = params.id

    // TODO: Fetch offer from database
    const offer = {
      id: offerId,
      shipmentId: '1',
      carrierId: '1',
      price: 15000,
      message: '迅速かつ安全に配送いたします',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(createSuccessResponse(offer))
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch offer'),
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = params.id
    const { status } = await request.json()

    // TODO: Update offer in database
    const updatedOffer = {
      id: offerId,
      status,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(createSuccessResponse(updatedOffer))
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to update offer'),
      { status: 500 }
    )
  }
}
