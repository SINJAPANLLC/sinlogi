import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch real vehicles from database
    const vehicles = [
      {
        id: '1',
        type: 'トラック',
        capacity: '2トン',
        location: '東京都',
        available: true,
        pricePerKm: 500,
        specialties: ['一般貨物', '冷凍食品']
      },
      {
        id: '2',
        type: '大型トラック',
        capacity: '10トン',
        location: '大阪府',
        available: true,
        pricePerKm: 800,
        specialties: ['大型貨物', '危険物']
      }
    ]

    return NextResponse.json(createSuccessResponse(vehicles))
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch vehicles'),
      { status: 500 }
    )
  }
}
/ ステータス
    if (status) {
      where.status = status
    }

    // 現在日時でフィルタリング（利用可能な期間内）
    const now = new Date()
    where.availableFrom = {
      lte: now
    }
    where.availableTo = {
      gte: now
    }

    // 車両を検索
    const [vehicles, totalCount] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          carrier: {
            select: {
              id: true,
              companyName: true,
              contactPerson: true,
              phone: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.vehicle.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        vehicles,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      )
    }

    // トークンからユーザーIDを取得
    const { verifyToken } = await import('@/lib/auth')
    const decoded = await verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        userType: true,
        verificationStatus: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 許可証承認済みユーザーのみ作成可能
    if (user.verificationStatus !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: '許可証が承認されるまで、車両を登録できません' },
        { status: 403 }
      )
    }

    // 都道府県配列をJSON文字列に変換
    const availablePrefectures = JSON.stringify(body.availablePrefectures || [])

    // 車両を作成
    const vehicle = await prisma.vehicle.create({
      data: {
        carrierId: user.id,
        vehicleType: body.vehicleType,
        vehicleNumber: body.vehicleNumber,
        driverName: body.driverName,
        driverPhone: body.driverPhone,
        maxWeight: parseFloat(body.maxWeight),
        maxVolume: body.maxVolume ? parseFloat(body.maxVolume) : null,
        length: body.length ? parseFloat(body.length) : null,
        width: body.width ? parseFloat(body.width) : null,
        height: body.height ? parseFloat(body.height) : null,
        hasLiftGate: body.hasLiftGate || false,
        hasRefrigeration: body.hasRefrigeration || false,
        hasTemperatureControl: body.hasTemperatureControl || false,
        canLoadUnload: body.canLoadUnload !== false,
        availablePrefectures,
        availableFrom: new Date(body.availableFrom),
        availableTo: new Date(body.availableTo),
        basePrice: body.basePrice ? parseFloat(body.basePrice) : null,
        minPrice: body.minPrice ? parseFloat(body.minPrice) : null,
        status: body.status || 'AVAILABLE',
        notes: body.notes || null
      },
      include: {
        carrier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
