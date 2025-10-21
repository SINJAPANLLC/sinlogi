import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAdminAuth(request)

    // TODO: Fetch documents from database
    const documents = [
      {
        id: '1',
        userId: '1',
        type: 'identity',
        filename: 'passport.pdf',
        status: 'pending',
        uploadedAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: '2',
        type: 'business',
        filename: 'business_license.pdf',
        status: 'approved',
        uploadedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json(createSuccessResponse(documents))
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch documents'),
      { status: 500 }
    )
  }
}
