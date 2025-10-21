import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        createErrorResponse('User not authenticated'),
        { status: 401 }
      )
    }

    return NextResponse.json(createSuccessResponse(user))
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to get user information'),
      { status: 500 }
    )
  }
}
    phone: true,
        postalCode: true,
        address: true,
        createdAt: true,
      },
    })
    
    if (!userData) {
      return unauthorizedResponse()
    }
    
    return successResponse(userData)
  } catch (error) {
    console.error('Get user error:', error)
    return unauthorizedResponse()
  }
}

