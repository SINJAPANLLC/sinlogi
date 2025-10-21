import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const verificationId = params.id

    // TODO: Fetch verification from database
    const verification = {
      id: verificationId,
      userId: '1',
      type: 'identity',
      status: 'pending',
      documents: ['passport', 'driver_license'],
      submittedAt: new Date().toISOString()
    }

    return NextResponse.json(createSuccessResponse(verification))
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch verification'),
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const verificationId = params.id
    const { status } = await request.json()

    // TODO: Update verification in database
    const updatedVerification = {
      id: verificationId,
      status,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(createSuccessResponse(updatedVerification))
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to update verification'),
      { status: 500 }
    )
  }
}
