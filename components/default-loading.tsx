import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

type DefaultLoadingProps = {
  containerClass?: string
  loadingClass?: string
}

const DefaultLoading = ({
  containerClass,
  loadingClass,
}: DefaultLoadingProps) => {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        containerClass,
      )}
    >
      <div className={cn('space-y-4', loadingClass)}>
        <Skeleton className="h-[20px] w-[200px]" />
        <Skeleton className="h-[20px] w-[200px]" />
        <Skeleton className="h-[20px] w-[200px]" />
      </div>
    </div>
  )
}

export default DefaultLoading
