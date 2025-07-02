'use client'

import { Sheet, SheetContent } from '~/components/ui/sheet'
import { useStore } from './store'

const MAP_SHEET: { [key: string]: React.ReactNode } = {

  // view: <SheetView />,
}

const SheetContainer = () => {
  const { isOpenSheet, setIsOpenSheet, mode } = useStore((state) => state)

  return (
    <Sheet open={isOpenSheet} onOpenChange={(open) => {
      setIsOpenSheet(false);
    }}>
      <SheetContent className="w-1/2  overflow-y-auto">{MAP_SHEET[mode]}</SheetContent>
    </Sheet>
  )
}

export default SheetContainer
